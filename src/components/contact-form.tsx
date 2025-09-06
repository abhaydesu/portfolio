"use client";

import { form } from 'motion/react-client';
import React, { useState } from 'react'
import { toast } from 'sonner';

export const ContactForm = () => {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('handle submit clicked');

        const { name, email, message } = formData;

        if (!name || !email || !message) {
            toast.error("Please fill all the fields");
            return;
        }

        //call your API here to submit the form.

        const response = await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('API call succesfull');
            }, 1000);
        })

        if (response) {
            toast.success('Form Submitted  successfully');
        } else {
            toast.error("Something went wrong");
        }
    }

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    })



    const handleChange = (e: 
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

  return (
    <form onSubmit={handleSubmit} className='py-10 flex flex-col gap-5 max-w-lg'>
        <div className="flex flex-col gap-2">
        <label className='text-sm font-medium tracking-tight text-neutral-600' htmlFor="name">Full name</label>
        <input 
        id='name' 
        name='name' 
        onChange={handleChange} 
        type="text" 
        placeholder='Anon Singh'
        className='shadow-aceternity rounded-md px-2 py-1 text-sm focus-outline-none focus-ring-2 focus:ring-primary'
        />
        </div>
        <div className="flex flex-col gap-2">
        <label className='text-sm font-medium tracking-tight text-neutral-600' htmlFor="email">Email-id</label>
        <input 
        id='email' 
        name='email' 
        onChange={handleChange} 
        type="email" 
        placeholder='anon@tries.com'
        className='shadow-aceternity rounded-md px-2 py-1 text-sm focus-outline-none focus-ring-2 focus:ring-primary'
        />
        </div>
        <div className="flex flex-col gap-2">
            <label 
            className='text-sm font-medium tracking-tight text-neutral-600 '
            htmlFor="message"
            >
                Message
            </label>
            <textarea
            rows={5}
            id='message' 
            name='message' 
            onChange={handleChange} 
            placeholder='The world is changing. Buckle up, anon.'
            className='shadow-aceternity rounded-md px-2 py-1 text-sm focus-outline-none focus-ring-2 focus:ring-primary resize-none'
            />
        </div>
        <button 
        type='submit'
        className='rounded-md bg-primary px-4 py-2 text-neutral-300'
        >
            Send message
        </button>
    </form>
  )
}
