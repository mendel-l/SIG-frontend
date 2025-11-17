import { Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { cn } from '@/utils';
import { BaseComponentProps } from '@/types';

interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full';
  showCloseButton?: boolean;
  children: ReactNode;
}

export function Modal({ 
  isOpen, 
  onClose, 
  size = 'md', 
  showCloseButton = true, 
  className,
  children 
}: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-full mx-4',
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={cn(
                'w-full transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all',
                sizeClasses[size],
                className
              )}>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

interface ModalHeaderProps extends BaseComponentProps {
  children: ReactNode;
}

export function ModalHeader({ className, children }: ModalHeaderProps) {
  return (
    <Dialog.Title
      className={cn(
        'text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4',
        className
      )}
    >
      {children}
    </Dialog.Title>
  );
}

interface ModalBodyProps extends BaseComponentProps {
  children: ReactNode;
}

export function ModalBody({ className, children }: ModalBodyProps) {
  return (
    <div className={cn('mb-6', className)}>
      {children}
    </div>
  );
}

interface ModalFooterProps extends BaseComponentProps {
  children: ReactNode;
}

export function ModalFooter({ className, children }: ModalFooterProps) {
  return (
    <div className={cn('flex justify-end gap-3', className)}>
      {children}
    </div>
  );
}
