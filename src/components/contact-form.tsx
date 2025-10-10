"use client";

import React, { useState } from 'react';
import { toast } from 'sonner';

export const ContactForm = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { name, email, message } = formData;

        if (!name || !email || !message) {
            toast.error("Please fill all the fields");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success('Form Submitted successfully');
                setFormData({ name: "", email: "", message: "" });
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } catch (error) {
            toast.error("Failed to send message. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='border-y border-neutral-100 dark:border-neutral-800 py-12 my-10 -mx-8 px-8'>
            <div className="max-w-lg px-4 flex flex-col gap-5 mx-auto">
                <div className="flex flex-col gap-2">
                    <label className='text-sm font-medium tracking-tight text-neutral-600' htmlFor="name">Full name</label>
                    <input
                        id='name'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        type="text"
                        placeholder='Anon Singh'
                        className='shadow-[var(--shadow-aceternity)] rounded-md px-2 py-1 text-sm focus-outline-none focus-ring-2 focus:ring-primary'
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className='text-sm font-medium tracking-tight text-neutral-600' htmlFor="email">Email-id</label>
                    <input
                        id='email'
                        name='email'
                        value={formData.email} 
                        onChange={handleChange}
                        type="email"
                        placeholder='anon@tries.com'
                        className='shadow-[var(--shadow-aceternity)] rounded-md px-2 py-1 text-sm focus-outline-none focus-ring-2 focus:ring-primary'
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
                        value={formData.message} 
                        onChange={handleChange}
                        placeholder='The world is changing. Buckle up, anon.'
                        className='shadow-[var(--shadow-aceternity)] rounded-md px-2 py-1 text-sm focus-outline-none focus-ring-2 focus:ring-primary resize-none'
                    />
                </div>
                <button
                    type='submit'
                    disabled={isLoading} 
                    className='rounded-md bg-primary px-4 py-2 text-white disabled:bg-opacity-70 disabled:cursor-not-allowed'
                >
                    {isLoading ? 'Sending...' : 'Send message'}
                </button>
            </div>
        </form>
    );
};