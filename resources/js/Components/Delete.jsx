import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useState } from "react";

import React from "react";

const Delete = ({ open, setOpen, selectedHotel }) => {
    const [password, setPassword] = useState("");
    const handleDelete = (hotel) => {
        router.delete(route("admin.hotels.destroy", hotel.id), {
            data: { password },
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Hotel deleted successfully.");
                setPassword("");
            },
            onError: (errors) => {
                toast.error(errors.password || "Incorrect password.");
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Delete Hotel</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete the hotel <strong>{selectedHotel?.name}</strong>.
                    </DialogDescription>
                </DialogHeader>
                <Input
                    type="password"
                    placeholder="Enter your password to continue"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={() => {
                            handleDelete(selectedHotel);
                            setOpen(false);
                        }}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default Delete;
