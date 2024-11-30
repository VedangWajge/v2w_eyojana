export const sendRevertEmail = async (email, message) => {
  
  try {
    const response = await fetch('http://localhost:5000/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,         // Recipient email
        message,       // The message (which may include revertMessage if status is "Reverted")
      }),
    });

    const data = await response.json();
    if (data.message) {
      console.log('Email sent successfully');
      return true;
    } else {
      console.error('Failed to send email');
      return false;
    }
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};
