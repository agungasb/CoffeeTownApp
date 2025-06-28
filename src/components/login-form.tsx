"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const loginFormSchema = z.object({
    username: z.string().min(1, "Username is required."),
    password: z.string().min(1, "Password is required."),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

interface LoginFormProps {
    onLoginSuccess: () => void;
    onCancel: () => void;
}

export default function LoginForm({ onLoginSuccess, onCancel }: LoginFormProps) {
    const t = useTranslations('LoginForm');
    const { toast } = useToast();
    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const handleSubmit = (data: LoginFormData) => {
        // Prototype login check
        if (data.username === 'agung' && data.password === 'freepalestine') {
            onLoginSuccess();
            toast({ title: 'Success', description: t('loginSuccess') });
        } else {
            toast({
                variant: 'destructive',
                title: t('loginFailed'),
                description: t('loginFailedDescription'),
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('usernameLabel')}</FormLabel>
                            <FormControl>
                                <Input placeholder="admin" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('passwordLabel')}</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={onCancel}>{t('cancelButton')}</Button>
                    <Button type="submit">{t('loginButton')}</Button>
                </div>
            </form>
        </Form>
    );
}
