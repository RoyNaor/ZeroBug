'use client';

import { useRouter } from 'next/navigation';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tooltip,
} from '@heroui/react';
import { useState } from 'react';

export default function DeleteIssueButton({ id }: { id: number }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/issues/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      router.push('/issues');
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <Tooltip content="Delete this Issue" closeDelay={0}>
            <Button color="danger" variant="shadow" onPress={onOpen}>
            Delete
        </Button>
    </Tooltip>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Delete Issue</ModalHeader>
              <ModalBody>
                Are you sure you want to delete this issue? 
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button color="danger" onPress={onDelete} isLoading={loading}>
                  Yes, delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
