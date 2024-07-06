import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Box,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import './Confirm.scss';

interface Props {
  isOpen: boolean;
  onConfirm: Function;
  onClose: () => void;
  onCancel?: Function;
  body?: string;
}

const Confirm = ({ isOpen, onConfirm, onClose, onCancel, body }: Props) => {
  const { t } = useTranslation();
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent className="confirm-modal-content">
        <ModalHeader>{t('components.confirmModal.title')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{body || t('components.confirmModal.defaultBody')}</ModalBody>
        <ModalFooter>
          <Box className="actions">
            <Button onClick={() => onConfirm()}>{t('general.confirm')}</Button>
            <Button onClick={onClose}>{t('general.close')}</Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Confirm;
