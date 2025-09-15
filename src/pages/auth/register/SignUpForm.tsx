"use client"


import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Link } from "react-router-dom"

export function SignUpForm() {

  return (
    <>
        <form  className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullname">Full name</Label>
            <Input
              id="fullname"
              name="fullname"
              type="text"
              className="w-full"
              required
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
            />
          </div>

          <Button type="submit" className="w-full">Request Access</Button>

          <Link to={'/'} className="block text-base text-foreground text-center opacity-80 hover:opacity-100 underline underline-offset-2">Sign In</Link>
        </form>
    </>
  )
}
