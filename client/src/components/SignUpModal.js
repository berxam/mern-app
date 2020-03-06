import React from 'react'

export default (props) => (
  <div ref={props.setRef} className="modal">
    <h2>Sign up</h2>
    <form autoComplete="off">
      <div className="text-input">
        <input
          id="email"
          placeholder=" "
          type="email"
          required
        />
        <label htmlFor="email">Email</label>
      </div>
      
      <div className="text-input">
        <input
          id="username"
          placeholder=" "
          type="text"
          required
        />
        <label htmlFor="username">Username</label>
      </div>

      <div className="text-input">
        <input
          id="password"
          placeholder=" "
          type="password"
          required
        />
        <label htmlFor="password">Password</label>
      </div>

      <div className="text-input">
        <input
          id="confirm_password"
          placeholder=" "
          type="password"
          required
        />
        <label htmlFor="confirm_password">Confirm password</label>
      </div>

      <button type="submit" className="btn-primary">Submit</button>
      <button type="button" onClick={props.closeModal} className="btn">Cancel</button>
    </form>
  </div>
)
