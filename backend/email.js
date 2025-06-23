export const getSchedulingEmailTemplate = (appointment, date, time, notes) => `
  <div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
    <!-- Header with Background -->
    <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Viewing Scheduled</h1>
      <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Zaroori Zameen Property Viewing</p>
    </div>

    <!-- Main Content -->
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
      <!-- Appointment Details -->
      <div style="background: #f0f7ff; border-left: 4px solid #2563eb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">Appointment Details</h2>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Property:</strong> ${appointment.propertyId.title}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Date:</strong> ${new Date(date).toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}

        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Time:</strong> ${time}
        </p>
        ${notes ? `
        <p style="margin: 8px 0; color: #374151;">
          <strong>Notes:</strong> ${notes}
        </p>
        ` : ''}
        <p style="margin: 8px 0; color: #374151;">
          <strong>Status:</strong> <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 14px; background: #fef3c7; color: #854d0e;">Pending</span>
        </p>
      </div>

      <!-- Next Steps -->
      <div style="margin-top: 30px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">What's Next?</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #fef3c7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #854d0e;">!</span>
            We will confirm your appointment shortly
          </li>
        </ul>
      </div>

      <!-- Contact Support -->
      <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Need Help?</h3>
        <p style="margin: 0; color: #4b5563;">
          Our support team is available 24/7 to assist you:
          <br>
          📧 <a href="mailto:waqasgul369@gmail.com" style="color: #2563eb; text-decoration: none;">waqasgul369@gmail.com.com</a>
          <br>
          📞 <a href="tel:+923488446186" style="color: #2563eb; text-decoration: none;">+923424244508</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px;">
      <p style="color: #6b7280; font-size: 14px;">
        © ${new Date().getFullYear()} Zaroori Zameen. All rights reserved.
      </p>
      <div style="margin-top: 10px;">
        <a href="https://real-estate-website-sepia-two.vercel.app" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Website</a>
        <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Terms of Service</a>
      </div>
    </div>
  </div>
`;


export const getEmailTemplate = (appointment, status,userEmail) => `
  <div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
    <!-- Header with Background -->
    <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}</h1>
      <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Zaroori Zameen Property Viewing</p>
    </div>

    <!-- Main Content -->
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
      <!-- Appointment Details -->
      <div style="background: #f0f7ff; border-left: 4px solid #2563eb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">Appointment Details</h2>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Property:</strong> ${appointment.propertyId.title}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Time:</strong> ${appointment.time}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Status:</strong> <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 14px; background: ${status === 'confirmed' ? '#dcfce7' : status === 'cancelled' ? '#fee2e2' : '#fef3c7'
  }; color: ${status === 'confirmed' ? '#166534' : status === 'cancelled' ? '#991b1b' : '#854d0e'
  };">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </p>
      </div>

      <!-- Next Steps -->
      <div style="margin-top: 30px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">What's Next?</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${status === 'confirmed' ? `
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="display: inline-block; width: 24px; height: 24px; background: #dcfce7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #166534;">✓</span>
              Arrive 10 minutes before your scheduled time
            </li>
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="display: inline-block; width: 24px; height: 24px; background: #dcfce7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #166534;">✓</span>
              Bring valid identification
            </li>
          ` : status === 'cancelled' ? `
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="display: inline-block; width: 24px; height: 24px; background: #fee2e2; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #991b1b;">i</span>
              You can schedule another viewing at any time
            </li>
          ` : `
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="display: inline-block; width: 24px; height: 24px; background: #fef3c7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #854d0e;">!</span>
              We will confirm your appointment shortly
            </li>
          `}
        </ul>
      </div>

      <!-- Contact Support -->
      <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Need Help?</h3>
        <p style="margin: 0; color: #4b5563;">
          Our support team is available 24/7 to assist you:
          <br>
          📧 <a href="mailto:waqasgul369@gmail.com" style="color: #2563eb; text-decoration: none;">waqasgul369@gmail.com</a>
          <br>
          📞 <a href="tel:+923488446186" style="color: #2563eb; text-decoration: none;">+92 3488446186</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px;">
      <p style="color: #6b7280; font-size: 14px;">
        © ${new Date().getFullYear()} Zaroori Zameen. All rights reserved.
      </p>
      <div style="margin-top: 10px;">
        <a href="https://real-estate-website-sepia-two.vercel.app" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Website</a>
        <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Terms of Service</a>
      </div>
    </div>
  </div>
`;

export const getNewsletterTemplate = (email) => `
<div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
  <!-- Header with Background -->
  <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to Zaroori Zameen!</h1>
    <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Your Premier Real Estate Newsletter</p>
  </div>

  <!-- Main Content -->
  <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
    <!-- Welcome Message -->
    <div style="text-align: center; margin-bottom: 30px;">
      <p style="font-size: 18px; color: #374151; margin: 0;">Hello <strong style="color: #2563eb;">${email}</strong></p>
      <p style="font-size: 16px; color: #4b5563; margin-top: 10px;">
        Thank you for joining our community of property enthusiasts!
      </p>
    </div>

    <!-- Benefits Section -->
    <div style="background: #f0f7ff; border-left: 4px solid #2563eb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">What You'll Get:</h2>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="margin-bottom: 12px; display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #2563eb;">✓</span>
          Latest Property Listings
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #2563eb;">✓</span>
          Real Estate Market Trends
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #2563eb;">✓</span>
          Exclusive Property Deals
        </li>
        <li style="display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #2563eb;">✓</span>
          Investment Opportunities
        </li>
      </ul>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 35px 0;">
      <a href="${process.env.WEBSITE_URL}"
         style="display: inline-block; padding: 16px 30px; background: linear-gradient(135deg, #2563eb, #1e40af); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
        Explore Properties
      </a>
    </div>

    <!-- Important Note -->
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 30px;">
      <p style="margin: 0; color: #4b5563; font-size: 14px;">
        <strong style="color: #1e40af;">📝 Note:</strong> To ensure you don't miss our updates, please add
        <a href="mailto:waqasgul369@gmail.com" style="color: #2563eb; text-decoration: none;">waqasgul369@gmail.com</a>
        to your contacts.
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 30px;">
    <div style="margin-bottom: 20px;">
      <a href="#" style="display: inline-block; margin: 0 8px; color: #2563eb; text-decoration: none;">
        <img src="https://img.icons8.com/ios-filled/24/4a90e2/facebook-new.png" alt="Facebook" style="width: 24px; height: 24px;">
      </a>
      <a href="#" style="display: inline-block; margin: 0 8px; color: #2563eb; text-decoration: none;">
        <img src="https://img.icons8.com/ios-filled/24/4a90e2/twitter.png" alt="Twitter" style="width: 24px; height: 24px;">
      </a>
      <a href="#" style="display: inline-block; margin: 0 8px; color: #2563eb; text-decoration: none;">
        <img src="https://img.icons8.com/ios-filled/24/4a90e2/instagram-new.png" alt="Instagram" style="width: 24px; height: 24px;">
      </a>
    </div>
    <p style="color: #6b7280; font-size: 14px; margin: 0;">
      © ${new Date().getFullYear()} Zaroori Zameen. All rights reserved.
    </p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 10px;">
      You can <a href="#" style="color: #2563eb; text-decoration: none;">unsubscribe</a> at any time.
    </p>
  </div>
</div>
`;

export const getWelcomeTemplate = (name) => `
<div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
  <!-- Header with Background -->
  <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to Zaroori Zameen!</h1>
    <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Your Dream Home Awaits</p>
  </div>

  <!-- Main Content -->
  <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
    <!-- Welcome Message -->
    <div style="text-align: center; margin-bottom: 30px;">
      <p style="font-size: 18px; color: #374151; margin: 0;">Hello <strong style="color: #2563eb;">${name}</strong></p>
      <p style="font-size: 16px; color: #4b5563; margin-top: 10px;">
        Welcome to our community of property enthusiasts! Your account has been successfully created.
      </p>
    </div>

    <!-- Features Section -->
    <div style="background: #f0f7ff; border-left: 4px solid #2563eb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">Unlock These Features:</h2>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="margin-bottom: 12px; display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #2563eb;">✓</span>
          Browse Premium Property Listings
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #2563eb;">✓</span>
          Schedule Property Viewings
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #2563eb;">✓</span>
          Save Favorite Properties
        </li>
        <li style="display: flex; align-items: center;">
          <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #2563eb;">✓</span>
          Direct Contact with Property Owners
        </li>
      </ul>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 35px 0;">
      <a href="${process.env.WEBSITE_URL}/properties"
         style="display: inline-block; padding: 16px 30px; background: linear-gradient(135deg, #2563eb, #1e40af); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
        Start Exploring Properties
      </a>
    </div>

    <!-- Support Section -->
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
      <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Need Assistance?</h3>
      <p style="margin: 0; color: #4b5563;">
        Our support team is available 24/7:
        <br>
        📧 <a href="mailto:waqasgul369@gmail.com" style="color: #2563eb; text-decoration: none;">waqasgul369@gmail.com</a>
        <br>
        📞 <a href="tel:+1234567890" style="color: #2563eb; text-decoration: none;">+92 3488446186</a>
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 30px;">
    <div style="margin-bottom: 20px;">
      <a href="#" style="display: inline-block; margin: 0 8px;">
        <img src="https://img.icons8.com/ios-filled/24/4a90e2/facebook-new.png" alt="Facebook" style="width: 24px; height: 24px;">
      </a>
      <a href="#" style="display: inline-block; margin: 0 8px;">
        <img src="https://img.icons8.com/ios-filled/24/4a90e2/twitter.png" alt="Twitter" style="width: 24px; height: 24px;">
      </a>
      <a href="#" style="display: inline-block; margin: 0 8px;">
        <img src="https://img.icons8.com/ios-filled/24/4a90e2/instagram-new.png" alt="Instagram" style="width: 24px; height: 24px;">
      </a>
    </div>
    <p style="color: #6b7280; font-size: 14px; margin: 0;">
      © ${new Date().getFullYear()} Zaroori Zameen. All rights reserved.
    </p>
    <div style="margin-top: 10px;">
      <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
      <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Terms of Service</a>
    </div>
  </div>
</div>
`;

export const getPasswordResetTemplate = (resetUrl) => `
  <div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
    <!-- Header with Background -->
    <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Reset Your Password</h1>
      <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Zaroori Zameen Account Security</p>
    </div>

    <!-- Main Content -->
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
      <!-- Security Notice Box -->
      <div style="background: #f0f7ff; border-left: 4px solid #2563eb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">Password Reset Request</h2>
        <p style="margin: 8px 0; color: #374151;">
          We received a request to reset your password for your Zaroori Zameen account. For your security, this link will expire in 10 minutes.
        </p>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin: 35px 0;">
        <a href="${resetUrl}"
           style="display: inline-block; padding: 16px 30px; background: linear-gradient(135deg, #2563eb, #1e40af); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
          Reset Password
        </a>
      </div>

      <!-- Security Tips -->
      <div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 20px; border-radius: 8px; margin: 30px 0;">
        <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">Security Notice</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #fde68a; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #92400e;">!</span>
            If you didn't request this password reset, please ignore this email
          </li>
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #fde68a; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: #92400e;">!</span>
            Never share this email or your password with anyone
          </li>
        </ul>
      </div>

      <!-- Support Section -->
      <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Need Help?</h3>
        <p style="margin: 0; color: #4b5563;">
          If you didn't request this reset or need assistance:
          <br>
          📧 <a href="mailto:security@Zaroori Zameen.com" style="color: #2563eb; text-decoration: none;">security@Zaroori Zameen.com</a>
          <br>
          📞 <a href="tel:+1234567890" style="color: #2563eb; text-decoration: none;">+92 3488446186</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px;">
      <p style="color: #6b7280; font-size: 14px;">
        © ${new Date().getFullYear()} Zaroori Zameen. All rights reserved.
      </p>
      <div style="margin-top: 10px;">
        <a href="https://real-estate-website-sepia-two.vercel.app" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Website</a>
        <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Terms of Service</a>
      </div>
    </div>
  </div>
`;