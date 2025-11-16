import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";

const DeleteModal = ({
    open,
    setOpen,
    resource,
    getDeleteRoute,
    successMessage,
}) => {
    const [password, setPassword] = useState("");
    const { flash } = usePage().props;

    const handleDelete = () => {
        router.delete(getDeleteRoute(resource), {
            data: { password },
            preserveScroll: true,
            onSuccess: (page) => {
                toast.success(
                    page.props.success ||
                        `${resource.name} deleted successfully.`
                );
                setPassword("");
                setOpen(false);
            },
            onError: (errors) => {
                toast.error(errors.password || "Incorrect password.");
            },
        });
    };
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Delete {resource?.name || "Item"}</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete <strong>{resource?.name}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <Input
                    type="password"
                    placeholder="Enter your password to continue"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-4"
                />

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteModal;
