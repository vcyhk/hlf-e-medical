import React, {useState} from 'react';

function SecurityQuestion({handleBack, handleSubmit, handleChange, data, loading}) {
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault();
    // validate the data
    // question1, question2, answer1, answer2 should not be empty
    if (data.question1 === '' || data.question2 === '' || data.answer1 === '' || data.answer2 === '') {
      setError('all fields are required')
    } else {
      setError('')
      handleSubmit();
    }
  }
  return (
    <div className="security-question container">
      <div>
        <div className="form">
          <h2>Please fill in both safety questions of your choices</h2>
          <p>it will be the key to reset your password when you forget you password.</p>
        </div>
      </div>
      {/* display error */}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit}>
        <div className="form-field">
          <label htmlFor="question1">Question 1</label>
          <select name="question1" id="question1" onChange={handleChange} value={data.question1}>
            <option value="">Please select</option>
            <option value="What is the name of your first pet?">What is the name of your first pet?</option>
            <option value="What is your mother's name?">What is your mother's name?</option>
            <option value="What was your first car?">What was your first car?</option>
            <option value="What is your best friend name?">What is your best friend name?</option>
          </select>
          <input type="text" name="answer1" id="answer1" placeholder='Answer 1' onChange={handleChange} value={data.answer1} required/>
        </div>
        <div className="form-field">
          <label htmlFor="question2">Question 2</label>
          <select name="question2" id="question2" onChange={handleChange} value={data.question2}>
            <option value="">Please select</option>
            <option value="What is the name of your first pet?">What is the name of your first pet?</option>
            <option value="What is your mother's name?">What is your mother's name?</option>
            <option value="What was your first car?">What was your first car?</option>
            <option value="What is your best friend name?">What is your best friend name?</option>
          </select>
          <input type="text" name="answer2" id="answer2" placeholder='Answer 2' onChange={handleChange} value={data.answer2} required/>
        </div>
        <div className="form-field" style={{display:'flex', justifyContent: 'space-between'}}>
          <button type="button" onClick={handleBack}>Cancel</button>
          <button type="submit"  disabled={loading}>
            {loading ? 'Confirm...' : 'Confirm'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SecurityQuestion;
