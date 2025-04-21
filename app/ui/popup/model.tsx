'use client';

import { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode | string;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    setShow(isOpen);
    if (isOpen) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const closeModal = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  if (!isOpen && !show) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[1000] p-4 bg-black/[0.25] transition-opacity duration-200 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
      onMouseDown={closeModal}>
      <div
        className={`max-h-[calc(min(80vh,800px))] relative flex flex-col min-h-[50vh] h-full shadow-[0px_2px_10px_rgba(0,0,0,0.15)] bg-white px-6 pb-2 rounded-lg max-w-[700px] w-full transform transition-transform duration-200 ${
          show ? 'scale-100' : 'scale-90'
        }`}
        onMouseDown={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
