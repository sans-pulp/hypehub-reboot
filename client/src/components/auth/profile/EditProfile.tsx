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

export const EditProfile = ({profile}: {profile: Profile}) => {
    
    const [firstName, setFirstName] = useState(profile.firstName);
    const [lastName, setLastName] = useState(profile.lastName);
    const [email, setEmail] = useState(profile.userEmail);
    const [bio, setBio] = useState(profile.bio ?? "");
    const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);
    // handle avatar upload - use supabase storage and try upload before saving
    // Upload file using standard upload
    const uploadFile = async (file: File) => {
        const { data, error } = await uploadAvatar(file)
        if (error) {
            setAvatarUploadError(error);
        } else {
            setAvatarUrl(data?.path ?? "");
        }
    }
    
   
    const handleSave = async () => {
        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("bio", bio);
        formData.append("avatarUrl", avatarUrl);
        console.log('formData', formData);
        // await updateProfile(profile.id, formData);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription className="text-md font-sans">
                        You can change your profile information here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder={firstName} value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder={lastName} value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" placeholder={email} value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" placeholder={bio} value={bio} onChange={(e) => setBio(e.target.value)}/>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}