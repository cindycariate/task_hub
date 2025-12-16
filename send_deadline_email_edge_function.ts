import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!

interface Task {
  id: string
  title: string
  deadline: string
  profile: {
    email: string
  }
}

Deno.serve(async () => {
  try {
    const now = Date.now()
    // Query tasks due between 22-23 hours from now
    const from = new Date(now + 22 * 60 * 60 * 1000).toISOString()
    const to = new Date(now + 23 * 60 * 60 * 1000).toISOString()

    console.log(`Checking for tasks due between ${from} and ${to}`)

    // Fetch tasks that are due soon and haven't sent reminders yet
    const { data: tasks, error: queryError } = await supabase
      .from('tasks')
      .select('id, title, deadline, profile:profiles(email)')
      .eq('reminder_sent', false)
      .gt('deadline', from)
      .lte('deadline', to)

    if (queryError) {
      console.error('Database query error:', queryError)
      throw queryError
    }

    if (!tasks || tasks.length === 0) {
      console.log('No tasks due in 22-23 hours that need reminders.')
      return new Response(JSON.stringify({ message: 'No reminders needed' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    console.log(`Found ${tasks.length} tasks to send reminders for`)

    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Send emails for each task
    for (const task of tasks as Task[]) {
      try {
        const deadlineDate = new Date(task.deadline)
        const hoursLeft = Math.floor((deadlineDate.getTime() - now) / (1000 * 60 * 60))

        console.log(`Sending reminder for task: ${task.title} to ${task.profile.email}`)

        // Send email via Resend
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'onboarding@resend.dev',
            to: task.profile.email,
            subject: `Task Deadline Reminder: ${task.title}`,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
                <h2 style="color: #333;">Task Deadline Reminder</h2>
                <p>Your task <strong>"${task.title}"</strong> is due in <strong>${hoursLeft} hours</strong>.</p>
                <p style="color: #666;">
                  <strong>Deadline:</strong> ${deadlineDate.toLocaleString('en-PH', {
                    timeZone: 'Asia/Manila',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p style="margin-top: 20px; color: #999; font-size: 12px;">
                  This is an automated reminder from TaskHub
                </p>
              </div>
            `,
          }),
        })

        if (!emailResponse.ok) {
          const emailError = await emailResponse.text()
          console.error(`Resend API error for task ${task.id}: ${emailError}`)
          results.failed++
          results.errors.push(`Task ${task.title}: Failed to send email`)
          continue
        }

        const emailResult = await emailResponse.json()
        console.log(`Email sent successfully for task ${task.id}: ${emailResult.id}`)

        // Update reminder_sent flag in database
        const { error: updateError } = await supabase
          .from('tasks')
          .update({ reminder_sent: true })
          .eq('id', task.id)

        if (updateError) {
          console.error(`Failed to update reminder_sent for task ${task.id}:`, updateError)
          results.failed++
          results.errors.push(`Task ${task.title}: Email sent but database update failed`)
          continue
        }

        console.log(`Successfully updated reminder_sent for task ${task.id}`)
        results.successful++
      } catch (taskError) {
        console.error(`Error processing task ${task.id}:`, taskError)
        results.failed++
        results.errors.push(
          `Task ${task.title}: ${taskError instanceof Error ? taskError.message : 'Unknown error'}`,
        )
      }
    }

    const message = `Reminders processed: ${results.successful} successful, ${results.failed} failed`
    console.log(message)

    return new Response(
      JSON.stringify({
        message,
        successful: results.successful,
        failed: results.failed,
        errors: results.errors,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
})
