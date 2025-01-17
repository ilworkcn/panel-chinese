import tw from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { useFlashKey } from '@/plugins/useFlash';
import ConfirmationModal from '@/components/elements/ConfirmationModal';
import { deleteSSHKey, useSSHKeys } from '@/api/account/ssh-keys';

export default ({ fingerprint }: { fingerprint: string }) => {
    const { clearAndAddHttpError } = useFlashKey('account');
    const [ visible, setVisible ] = useState(false);
    const { mutate } = useSSHKeys();

    const onClick = () => {
        clearAndAddHttpError();

        Promise.all([
            mutate((data) => data?.filter((value) => value.fingerprint !== fingerprint), false),
            deleteSSHKey(fingerprint),
        ])
            .catch((error) => {
                mutate(undefined, true);
                clearAndAddHttpError(error);
            });
    };

    return (
        <>
            <ConfirmationModal
                visible={visible}
                title={'SSH 密钥删除确定'}
                buttonText={'确定删除'}
                onConfirmed={onClick}
                onModalDismissed={() => setVisible(false)}
            >
                你真的确定删除这个 SSH 密钥?
            </ConfirmationModal>
            <button css={tw`ml-4 p-2 text-sm`} onClick={() => setVisible(true)}>
                <FontAwesomeIcon
                    icon={faTrashAlt}
                    css={tw`text-neutral-400 hover:text-red-400 transition-colors duration-150`}
                />
            </button>
        </>
    );
};
