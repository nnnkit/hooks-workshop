import React, { useState, useReducer } from "react"
import { signup } from "app/utils"
import TabsButton from "app/TabsButton"
import { FaDumbbell } from "react-icons/fa"
import { DateFields, MonthField, DayField, YearField } from "app/DateFields"
import TextInput from "app/TextInput"

export default function SignupForm() {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SIGNUP_FAILED":
          return { ...state, loading: false, error: action.error }
        case "SIGNUP_ATTEMPT": {
          return { ...state, loading: true }
        }
        case "UPDATE_DATE": {
          return { ...state, startDate: action.date }
        }
      }
    },
    {
      error: null,
      loading: false,
      startDate: new Date("March 1, 2019")
    }
  )

  const { error, loading, startDate } = state

  const handleSignup = async event => {
    event.preventDefault()
    dispatch({ type: "SIGNUP_ATTEMPT" })
    const [displayName, photoURL, email, password] = event.target.elements
    try {
      await signup({
        displayName: displayName.value,
        email: email.value,
        password: password.value,
        photoURL: photoURL.value,
        startDate
      })
    } catch (error) {
      dispatch({ type: "SIGNUP_FAILED", error })
    }
  }

  return (
    <div>
      {error && (
        <div>
          <p>Oops, there was an error logging you in.</p>
          <p>
            <i>{error.message}</i>
          </p>
        </div>
      )}

      <form onSubmit={handleSignup}>
        <TextInput id="displayName" label="Display Name" />
        <TextInput id="photoURL" label="Avatar URL" />
        <TextInput id="email" label="Email" />
        <TextInput id="password" label="Password" type="password" />
        <p>
          <span aria-hidden="true">Start:</span>{" "}
          <DateFields
            value={startDate}
            onChange={date => dispatch({ type: "UPDATE_DATE", date })}
          >
            <MonthField aria-label="Start Month" /> /{" "}
            <DayField aria-label="Start Day" /> /{" "}
            <YearField start={2018} end={2019} aria-label="Start year" />
          </DateFields>
        </p>
        <TabsButton>
          <FaDumbbell />
          <span>{loading ? "Loading..." : "Sign Up"}</span>
        </TabsButton>
      </form>
    </div>
  )
}
