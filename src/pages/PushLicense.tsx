import HelpIcon from '@mui/icons-material/Help';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from 'react';
import MessageText from '../components/MessageText';
import SolsticeInfoTooltip from '../components/SolsticeInfoTooltip';
import addresPreview from '../assets/address-preview.svg'
import { useLicenseContext } from './LicenseContext';
import React, { useEffect } from 'react';


export default function PushLicense() {
  const [deviceIPInput, setDeviceIPInput] = useState('');
  const [devicePasswordInput, setDevicePasswordInput] = useState('');

  const [deviceIPError, setDeviceIPInputError] = useState(false);
  const [devicePasswordError, setDevicePasswordError] = useState(false);

  const [pathToLicenseInput, setPathToLicenseInput] = useState('');
  const [pathToLicenseError, setPathToLicenseError] = useState(false);

  const [passwordVisability, setPasswordVisability] = useState(false)

  const [messageIpTextValue, setMessageIpTextValue] = useState('');
  const [messageIpSuccess, setMessageIpSuccess] = useState(false);
  const [messageIpHide, setMessageIpHide] = useState(true);

  const [messagePasswordTextValue, setMessagePasswordTextValue] = useState('');
  const [messagePasswordSuccess, setMessagePasswordSuccess] = useState(false);
  const [messagePasswordHide, setMessagePasswordHide] = useState(true);

  const [messagePathTextValue, setMessagePathTextValue] = useState('');
  const [messagePathSuccess, setMessagePathSuccess] = useState(false);
  const [messagePathHide, setMessagePathHide] = useState(true);

  const [file, setInputFile] = useState<File | undefined>(undefined);

  const [loading, setLoading] = useState(false);

  const { selectedFile, setFile } = useLicenseContext();

  useEffect(() => {
    // Update pathToLicenseInput when selectedFile changes
    if (selectedFile && selectedFile.file) {
      const myFile = new File([selectedFile.file], selectedFile.name, {
        type: selectedFile.file.type,
      });
      setPathToLicenseInput(selectedFile.name);
      setInputFile(myFile)
    }
  }, [selectedFile]);


  // Small section for toolpit control
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleDevicePasswordError = (messagePasswordSuccess: boolean, passwordErrorTruerFalse: boolean, messageHideTrueOrFalse: boolean, text: string) => {
    setMessagePasswordSuccess(messagePasswordSuccess)
    setDevicePasswordError(passwordErrorTruerFalse)
    setMessagePasswordHide(messageHideTrueOrFalse)
    setMessagePasswordTextValue(text);
  }

  const handleDevicePathdError = (messagePathSuccess: boolean, pathErrorTruerFalse: boolean, messageHideTrueOrFalse: boolean, text: string) => {
    setMessagePathSuccess(messagePathSuccess)
    setPathToLicenseError(pathErrorTruerFalse)
    setMessagePathHide(messageHideTrueOrFalse)
    setMessagePathTextValue(text);
  }

  const handleDeviceIPError = (messageIpSuccess: boolean, ipErrorTruerFalse: boolean, messageHideTrueOrFalse: boolean, text: string) => {
    setMessageIpSuccess(messageIpSuccess)
    setDeviceIPInputError(ipErrorTruerFalse)
    setMessageIpHide(messageHideTrueOrFalse)
    setMessageIpTextValue(text);
  }

  const handelLicenseUploadSuccess = () => {
    setDeviceIPInput("")
    setDevicePasswordInput("")
    setPathToLicenseInput("")
    setInputFile(undefined)
    handleDeviceIPError(true, false, false, "")
    handleDevicePathdError(true, false, false, "")
    handleDevicePasswordError(true, false, false, "Pod with is restarting and the license file is succesfully applied")
  }

  const handlePushClick = async () => {

    if (deviceIPInput.length <= 0) {
      handleDeviceIPError(false, true, false, "Please enter a IP address of the Pod and try again.")
      handleDevicePasswordError(true, false, false, "")
      handleDevicePathdError(true, false, false, "")
      return
    }

    if (devicePasswordInput.length <= 0) {
      handleDevicePasswordError(false, true, false, "Please enter a Pods password try again.")
      handleDeviceIPError(true, false, false, "")
      handleDevicePathdError(true, false, false, "")
      return
    }

    if (pathToLicenseInput.length <= 0) {
      handleDevicePathdError(false, true, false, "Please select .bin licesne file and try again.")
      handleDeviceIPError(true, false, false, "")
      handleDevicePasswordError(true, false, false, "")
      return
    }

    // const serverURL = "http://127.0.0.1:5000";
    const serverURL = "https://flask-mersive-server.onrender.com/";

    if (!file) {
      // Handle the case where no file is selected
      return;
    }

    try {

      setLoading(true)

      const requestData = new FormData();
      requestData.append("LICENSE_pkg", file);
      requestData.append("podIp", deviceIPInput);
      requestData.append("podPassword", devicePasswordInput);

      const response = await fetch(serverURL, {
        method: "POST",
        body: requestData,
      });

      const responseBody = await response.json();
      console.log(responseBody);

      // Response from server meaning that IP is wrong or Pod is anreachable
      if (responseBody.message === 'can not connect') {
        handleDeviceIPError(false, true, false, "Cannot connect to the Pod! Please make sure your computer can reach Pod, and the device IP address is correct")
        handleDevicePasswordError(true, false, false, "")
        handleDevicePathdError(true, false, false, "")
      }

      // Response from server meaning Password is wrong or missing
      if (responseBody.message === 'Please provide a password') {
        handleDevicePasswordError(false, true, false, "Invalid password. Please check your password and try again.")
        handleDeviceIPError(true, false, false, "")
        handleDevicePathdError(true, false, false, "")
      }

      //Respnse meaning that license file is wrong
      if (responseBody.message === 'Unable to apply license file change') {
        handleDevicePathdError(false, true, false, "Invalid license file. Please make sure the license file is correct.")
        handleDeviceIPError(true, false, false, "")
        handleDevicePasswordError(true, false, false, "")
      }


      //Error means that command was successfully sent to the Pod and Pod is restarted.
      if (responseBody.message === "socket hangs up") {
        console.log(responseBody)
        setLoading(false)
        return
        // handelLicenseUploadSuccess()
      }

      setLoading(false)


    } catch (error: any) {
      setLoading(false)
      console.error("Error:", error.message);
    }

  }

  const handleIPInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeviceIPInput(event.target.value);
  };

  const handlePasswordInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDevicePasswordInput(event.target.value);
  };

  const handlePasswordVisability = () => {
    if (passwordVisability === true) {
      setPasswordVisability(false)
    } else {
      setPasswordVisability(true)
    }
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setPathToLicenseInput(selectedFile.name);
      setInputFile(selectedFile)
      // You can handle the file upload logic here or store the file for later use.
    }
  };


  return (
    <div className="card">

      <h2>Push License</h2>
      <p>Utilize this tool to push one license file to a Mersive Pod running Solstice version 5.5.3 or higher.</p>


      <div className="input-icons">
        <input className={`input-field device-field-error-${deviceIPError}`} type="text" placeholder='Pod IP address' value={deviceIPInput}
          onChange={handleIPInputChange} />
        <span>

          <SolsticeInfoTooltip open={open} onClose={handleClose} onOpen={handleOpen} title={
            <div>
              <h5 style={{ color: "white", fontSize: "medium" }} >
                Where is the display address?
              </h5>
              <img src={addresPreview} alt="Vite logo" />
              <p style={{ color: "white", fontSize: "small" }}>The address starts with http:// and is usually located at the top right of the room display.</p>
            </div>
          } placement="top">
            <HelpIcon className={`icon icon-error-${deviceIPError}`} />

          </SolsticeInfoTooltip>
          <span />
        </span>
      </div>


      <div className="input-icons">
        <input className={`input-field device-field-error-${devicePasswordError}`} placeholder='Pod password  (if set)' type={passwordVisability ? "text" : "password"} value={devicePasswordInput}
          onChange={handlePasswordInputChange} />

        <span onClick={handlePasswordVisability}>
          {passwordVisability ? <VisibilityIcon className={`icon icon-error-${devicePasswordError}`} /> : <VisibilityOffIcon className={`icon icon-error-${devicePasswordError}`} />}

        </span>
      </div>


      <div className='browse-button-card'>

        <input
          className={`input-field device-field-error-${pathToLicenseError}`}
          type="text"
          placeholder='Path to a .bin license file'
          value={pathToLicenseInput}
          readOnly // make the input not modifiable
        />


        <label htmlFor="fileInput" className="browse-button">
          Browse
        </label>
        <input
          id="fileInput"
          type="file"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
      </div>

      {loading ? <button className={`submit-button-unactive`}>
        Loading ...
      </button> : <button className={`submit-button`} onClick={handlePushClick} >
        Push Licese File
      </button>}

      <MessageText
        text={messageIpTextValue}
        success={messageIpSuccess}
        hide={messageIpHide}
      />

      <MessageText
        text={messagePasswordTextValue}
        success={messagePasswordSuccess}
        hide={messagePasswordHide}
      />

      <MessageText
        text={messagePathTextValue}
        success={messagePathSuccess}
        hide={messagePathHide}
      />
    </div>
  );
}

