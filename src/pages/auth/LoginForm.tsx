"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import { login } from "../../services/authService"
import { Link, useNavigate } from "react-router-dom"

export function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const [loggingIn, setLoggingIn] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoggingIn(true)

    try {
      const data = await login(formData.username, formData.password)
      const token = data.token
      if (token) {
        localStorage.setItem('jwtToken', token)
        console.log("Login successful!", formData)
        navigate("/dashboard") // redirect on success
      } else {
        setError("Invalid response from server")
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "We don't recognize this username and password combination"
      )
    } finally {
      setLoggingIn(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  return (
    <>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2"> 
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-0 top-0 h-full px-4 py-1 cursor-pointer hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!formData.username || !formData.password || !!error || loggingIn}>
            {loggingIn ? "Signing In..." : "Sign In"}
          </Button>

          {/* <Link to={'/create-account'} className="block text-base text-foreground text-center opacity-80 hover:opacity-100 underline underline-offset-2">Create account</Link> */}
        </form>
    </>
  )
}
