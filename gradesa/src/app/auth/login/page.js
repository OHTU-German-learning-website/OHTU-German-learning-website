'use client'

export default function Login() {
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');

    console.log('Email:', email);
    console.log('Password:', password);
  }
  
  return (
    <>
      <h1 className="auth-title">Anmeldung</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">E-Mail-Adresse</label>
          <input className="form-input" type="email" id="email" name="email" required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Passwort</label>
          <input className="form-input" type="password" id="password" name="password" required />
        </div>

        <button type="submit" className="form-button">Einloggen</button>
      </form>
    </>
  );
}
