import React, { useState } from 'react';
import HelpIcon from '@mui/icons-material/Help';
import { saveAs } from 'file-saver';
import MessageText from '../components/MessageText';
import JSZip from 'jszip';
import SolsticeInfoTooltip from '../components/SolsticeInfoTooltip';
import { useLicenseContext } from './LicenseContext';

export default function DownloadLicense() {
    const [deviceIdsInput, setDeviceIdsInput] = useState('');
    const [deviceIdsInputError, setDeviceIdsInputError] = useState(false);
    const [messageTextValue, setMessageTextValue] = useState('');
    const [messageSuccess, setMessageSuccess] = useState(false);
    const [messageHide, setMessageHide] = useState(true);

    const [loading, setLoading] = useState(false);

    const [open, setOpen] = React.useState(false);

    const { setFile } = useLicenseContext();

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDeviceIdsInput(event.target.value);
    };

    const handleErrorMessage = (messageSuccess: boolean, deviceIdsInputError: boolean, MessageHide: boolean, text: string) => {
        setMessageSuccess(messageSuccess);
        setDeviceIdsInputError(deviceIdsInputError);
        setMessageHide(MessageHide);
        setMessageTextValue(text);
    }

    const handleDownloadClick = async () => {
        if (deviceIdsInput.length <= 0) {
            handleErrorMessage(false, true, false, "Please enter a valid Serial Number or Device Id and try again.")
            return
        }

        const specialCharactersRegex = /[-;:, ]+/;
        const deviceIdsArray = deviceIdsInput.split(specialCharactersRegex);

        const URL = "https://kepler-backend.mersive.com:443/licensing/v1";
        const headers = {
            "Content-Type": "application/json",
            "accept": "application/json"
        };

        try {

            setLoading(true)
            if (deviceIdsArray.length === 1) {
                // Existing logic for a single file
                const deviceId = deviceIdsArray[0];
                const licenseJson = { "keplerId": deviceId };

                const response = await fetch(`${URL}/license/license`, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(licenseJson)
                });

                if (response.status === 404) {
                    handleErrorMessage(false, true, false, `Cannot download license file for - ${deviceIdsInput} If you are sure it is correct Serial Number or Device ID, please contact support@mersive.com`)
                    setLoading(false)
                    return
                }


                const licenseFile = await response.text();
                setLoading(false)
                saveFile(licenseFile, `mcl_${deviceId}.bin`, 'application/octet-stream').then(function () { successDownloadLicense() })
                

            } else {
                
                // If multiple device IDs are provided, create a zip file
                const zip = new JSZip();

                // Loop through each device ID in the array
                for (const deviceId of deviceIdsArray) {
                    const licenseJson = { "keplerId": deviceId };

                    const response = await fetch(`${URL}/license/license`, {
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify(licenseJson)
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const content = await response.text();

                    // Add file to the zip
                    zip.file(`mcl_${deviceId}.bin`, content, { binary: true });
                }

                // Generate the zip file
                zip.generateAsync({ type: "blob" }).then((blob) => {
                    // Save the zip file
                    saveAs(blob, 'multiple_files.zip');
                });
                setLoading(false)
            }
        } catch (error: any) {
            console.error('Error:', error.message);
            console.log(error)
        }
    };

    const successDownloadLicense = () => {
        setDeviceIdsInput('')
        setDeviceIdsInputError(false);
        setMessageTextValue(`License successfully downloaded`);
        setMessageSuccess(true);
        setMessageHide(true);
    }

    const saveFile = (content: any, fileName: string, fileType: any) => {
        const blob = new Blob([content], { type: fileType });
        return new Promise(resolve => {
            saveAs(blob, fileName);
            setFile({file: blob, name:fileName }); // Set the file in the context
            return resolve(true);
        });

    };

    return (
        <div className="card">
            <h2>Download licenses</h2>
            <p>Utilize this tool to download one or multiple license files for Mersive Pods running Solstice version 5.5.3 or higher.</p>

            <div className="input-icons">
                <input
                    className={`input-field device-field-error-${deviceIdsInputError}`}
                    type="text"
                    placeholder='Pod Device IDs or Serial Numbers'
                    value={deviceIdsInput}
                    onChange={handleInputChange}
                />
                <span>
                    <SolsticeInfoTooltip open={open} onClose={handleClose} onOpen={handleOpen} title={<p style={{ color: "white", fontSize: "small" }}>Solstice Dashboard for Enterprise Edition is a centralized management tool that can be used to
                        monitor, configure, and update Solstice Enterprise Edition Pods and Windows Software instances on a
                        network. While each Solstice display can be configured individually via its local configuration panel,
                        Solstice Dashboard streamlines the deployment process and allows IT administrators to manage their
                        deployment from a central location.
                    </p>} placement="top">
                        <HelpIcon className={`icon icon-error-${deviceIdsInputError}`} />

                    </SolsticeInfoTooltip>
                </span>
            </div>


            {loading ? <button className={`submit-button-unactive`}>
                Loading ...
            </button> : <button className='submit-button' onClick={handleDownloadClick}>
                Download
            </button>}

            

            <MessageText
                text={messageTextValue}
                success={messageSuccess}
                hide={messageHide}
            />
        </div>
    );
}
