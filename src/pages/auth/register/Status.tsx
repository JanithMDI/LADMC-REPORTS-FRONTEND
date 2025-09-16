import { Check, X } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

export const Status = () => {
    const [status] = useState(true); 
    return (
        <>
            {status ? 
            <div className="p-6 md:p-0 w-full md:w-[456px] mt-20 mx-auto flex flex-col gap-4">
                <div className="bg-green-200 h-16 w-16 rounded-full flex items-center justify-center mx-auto border-8 border-green-100">
                    <Check className="text-green-800" />
                </div>
                <h1 className="text-3xl font-medium text-center mt-6">Thanks for signing up.</h1>
                <p className="text-center text-muted-foreground">
                  Your account request has been submitted. Once your account is set up, your <span className="text-foreground">username</span> and <span className="text-foreground">password</span> will be sent to your registered email address.
                </p>
                <Link to={'/'} className="block text-base text-foreground text-center opacity-80 hover:opacity-100 underline underline-offset-2">Sign In</Link>
            </div>
            :
            <div className="p-6 md:p-0 w-full md:w-[456px] mt-20 mx-auto flex flex-col gap-4">
                <div className="bg-red-200 h-16 w-16 rounded-full flex items-center justify-center mx-auto border-8 border-red-100">
                    <X className="text-red-800" />
                </div>
                <h1 className="text-3xl font-medium text-center mt-6">Account Setup Failed.</h1>
                <p className="text-center text-muted-foreground">Account setup failed. We were unable to send your username and password to your email. Please try again <Link to={'/'}>contact support</Link> </p>
                <Link to={'/create-account'} className="block text-base text-foreground text-center opacity-80 hover:opacity-100 underline underline-offset-2">Try Again</Link>
            </div>
            }
        </>
    )
}

