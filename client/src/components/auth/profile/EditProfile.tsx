'use client'

import { useState } from "react";

import {Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Profile } from "@/db/schema";
import { updateProfile, uploadAvatar } from "@/app/profile/actions";
import { useRouter } from "next/navigation";

export const EditProfile = ({profile}: {profile: Profile}) => {
    
    const [firstName, setFirstName] = useState(profile.firstName);
    const [lastName, setLastName] = useState(profile.lastName);
    const [email, setEmail] = useState(profile.userEmail);
    const [bio, setBio] = useState(profile.bio ?? "");
    const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    // handle avatar upload - use supabase storage and try upload before saving
    const uploadFile = async () => {
        if (avatarFile) {
        const { data, error } = await uploadAvatar(avatarFile, profile.id)
        if (error) {
            setAvatarUploadError(error);
            return null;
        } 
        else {
            setAvatarUploadError(null);
            setAvatarUrl(data?.path ?? "");
            return data?.path;
        }
        }
    }
    
   
    const handleSave = async () => {
        setIsSubmitting(true);
        const newAvatarUrl = await uploadFile();
        if (avatarUploadError) {
            return;
        }
  
        try {
            const formData = new FormData();
            formData.append("firstName", firstName);
            formData.append("lastName", lastName);
            formData.append("email", email);
            formData.append("bio", bio);
            const finalAvatarUrl = newAvatarUrl || avatarUrl;
            if (finalAvatarUrl) {
                formData.append("avatarUrl", finalAvatarUrl);
            }
            // console.log('formData', formData.values());
            const saveResult = await updateProfile(profile.id, formData);
            if (saveResult.error) {
                setSaveError(saveResult.error);
            }
            if (saveResult.success) {
                setOpen(false);
                router.refresh();
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            setSaveError('An error occurred while saving your profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }

    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="font-pixel text-sm">
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800">
                <DialogHeader>
                    <DialogTitle className="font-pixel text-xl text-white">
                        Edit Profile
                    </DialogTitle>
                    <DialogDescription className="font-grotesk text-base text-gray-400">
                        You can change your profile information here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 font-pixel">
                    <div className="grid gap-2">
                        <Label htmlFor="firstName" className="text-xs text-white">
                            First Name
                        </Label>
                        <Input 
                            id="firstName" 
                            placeholder={firstName} 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)}
                            className="font-body text-base text-white"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="lastName" className="text-xs text-white">
                            Last Name
                        </Label>
                        <Input 
                            id="lastName" 
                            placeholder={lastName} 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)}
                            className="font-body text-base text-white"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-xs text-white">
                            Email
                        </Label>
                        <Input 
                            id="email" 
                            placeholder={email} 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="font-body text-base text-white"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="bio" className="text-xs text-white">
                            Bio
                        </Label>
                        <Textarea 
                            id="bio" 
                            placeholder={bio} 
                            value={bio} 
                            onChange={(e) => setBio(e.target.value)}
                            className="font-body text-base text-white"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="avatar" className="text-xs text-white">
                            Avatar
                        </Label>
                        <Input 
                            id="avatar" 
                            type="file" 
                            onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                            className="font-body text-base text-white [&::file-selector-button]:text-white"
                        />
                        {avatarUploadError && (
                            <p className="text-red-400 text-xs font-pixel">
                                {avatarUploadError}
                            </p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button 
                        type="submit" 
                        onClick={handleSave} 
                        disabled={isSubmitting}
                        className="font-pixel text-sm"
                    >
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
                {saveError && (
                    <p className="text-red-400 text-xs font-pixel mt-2">
                        {saveError}
                    </p>
                )}
            </DialogContent>
        </Dialog>
    )
}
