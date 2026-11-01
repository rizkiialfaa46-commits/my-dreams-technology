require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
)

async function main() {
  const userId = '2c67410e-f578-4fdb-a745-9b24e7a2812c'

  const { data, error } =
    await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { email_confirm: true }
    )

  if (error) {
    console.error('ERROR:', error.message)
    process.exit(1)
  }

  console.log('BERHASIL!')
  console.log('Email:', data.user.email)
  console.log('Email sudah dikonfirmasi.')
}

main()