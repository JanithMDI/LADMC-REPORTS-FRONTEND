"use client"


import { useState } from "react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Link } from "react-router-dom"
import { Status } from './Status'

interface SignUpFormProps {
  createUser: (username: string, email: string) => Promise<any>;
}

export function SignUpForm({ createUser }: SignUpFormProps) {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showStatus, setShowStatus] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await createUser(fullname, email);
      setSuccess("Account request submitted!");
      setFullname("");
      setEmail("");
      setShowStatus(true); // Show Status component on success
    } catch (err: any) {
      console.log('====================================');
      console.log(err);
      console.log('====================================');
      setError(err?.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  if (showStatus) {
    return <Status />;
  }

  return (
    <>
    <h1 className='text-3xl font-semibold capitalize'>Create account</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="fullname">Full name</Label>
          <Input
            id="fullname"
            name="fullname"
            type="text"
            className="w-full"
            required
            value={fullname}
            onChange={e => setFullname(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="text"
            className="w-full"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "Request Access"}
        </Button>

        {success && <div className="text-green-600 text-sm">{success}</div>}

        <Link to={'/'} className="block text-base text-foreground text-center opacity-80 hover:opacity-100 underline underline-offset-2">Sign In</Link>
      </form>
    </>
  )
}
