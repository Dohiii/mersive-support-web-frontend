import React, { useState } from "react";
import HelpIcon from "@mui/icons-material/Help";
import { saveAs } from "file-saver";
import MessageText from "../components/MessageText";
import SolsticeInfoTooltip from "../components/SolsticeInfoTooltip";
import { useLicenseContext } from "./LicenseContext";

export default function DownloadLicense() {
  const [deviceIdsInput, setDeviceIdsInput] = useState("");
  const [deviceIdsInputError, setDeviceIdsInputError] = useState(false);
  const [messageTextValue, setMessageTextValue] = useState("");
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [messageHide, setMessageHide] = useState(true);

  const [errorMessageTextValue, setErrorMessageTextValue] = useState("");
  const [errorMessageSuccess, setErrorMessageSuccess] = useState(false);
  const [errorMessageHide, setErrorMessageHide] = useState(true);

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

  const handleErrorMessage = (
    messageSuccess: boolean,
    deviceIdsInputError: boolean,
    MessageHide: boolean,
    text: string
  ) => {
    setErrorMessageSuccess(messageSuccess);
    setDeviceIdsInputError(deviceIdsInputError);
    setErrorMessageHide(MessageHide);
    setErrorMessageTextValue(text);
  };

  const successDownloadLicense = (text: string) => {
    setDeviceIdsInput("");
    setDeviceIdsInputError(false);
    setMessageTextValue(text);
    setMessageSuccess(true);
    setMessageHide(false);
  };

  const handleDownloadClick = async () => {
    setErrorMessageHide(true);
    setMessageHide(true);

    if (deviceIdsInput.length <= 0) {
      handleErrorMessage(
        false,
        true,
        false,
        "Please enter a valid Serial Number or Device Id and try again."
      );
      return;
    }

    const specialCharactersRegex = /[-;:, ]+/;
    const deviceIdsArray = deviceIdsInput.split(specialCharactersRegex);

    const URL = "https://kepler-backend.mersive.com:443/licensing/v1";
    const headers = {
      "Content-Type": "application/json",
      accept: "application/json",
    };

    try {
      setLoading(true);

      let successDownload = 0;
      let failedDownload = 0;

      let failedDownlodArr = [];
      let successDownloadArr = [];

      // Loop through each device ID in the array
      for (const deviceId of deviceIdsArray) {
        let licenseJson: { keplerId?: string; serialId?: string } = {};

        if (deviceId.startsWith("MPOD") || deviceId.startsWith("mpod")) {
          licenseJson.serialId = deviceId.toUpperCase();
        } else {
          licenseJson.keplerId = deviceId.toLowerCase();
        }

        const response = await fetch(`${URL}/license/license`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(licenseJson),
        });

        if (response.status === 404) {
          setLoading(false);
          failedDownlodArr.push(deviceId);
          failedDownload++;
          continue;
        }

        const licenseFile = await response.text();
        licenseJson = {};
        setLoading(false);
        saveFile(
          licenseFile,
          `mcl_${deviceId}.bin`,
          "application/octet-stream"
        );
        successDownloadArr.push(deviceId);
        successDownload++;
      }

      if (successDownloadArr.length === 0) {
        handleErrorMessage(
          false,
          true,
          false,
          `Cannot download license file for - ${failedDownlodArr.join(
            ", "
          )} If you are sure it is correct Serial Number or Device ID, please contact support@mersive.com`
        );
      }

      if (failedDownlodArr.length === 0) {
        successDownloadLicense(
          `${successDownload} license files successfully downloaded: ${successDownloadArr.join(
            ", "
          )}`
        );
      }

      if (successDownloadArr.length > 0 && failedDownlodArr.length > 0) {
        successDownloadLicense(
          `${successDownload} license files succesfully downloaded ${successDownloadArr.join(
            ", "
          )}`
        );
        handleErrorMessage(
          false,
          true,
          false,
          `Cannot download license file for - ${failedDownlodArr.join(
            ", "
          )} If you are sure it is correct Serial Number or Device ID, please contact support@mersive.com`
        );
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      console.log(error);
    }
  };

  const saveFile = (content: any, fileName: string, fileType: any) => {
    const blob = new Blob([content], { type: fileType });
    return new Promise((resolve) => {
      saveAs(blob, fileName);
      setFile({ file: blob, name: fileName }); // Set the file in the context
      return resolve(true);
    });
  };

  return (
    <div className="card">
      <div className="input-icons">
        <input
          className={`input-field device-field-error-${deviceIdsInputError}`}
          type="text"
          placeholder="Pod Device IDs or Serial Numbers"
          value={deviceIdsInput}
          onChange={handleInputChange}
        />
        <span>
          <SolsticeInfoTooltip
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            title={
              <p style={{ color: "white", fontSize: "small" }}>
                <h6 style={{ color: "white", fontSize: "small" }}>
                  {" "}
                  Device ID can be retrieved:
                </h6>
                <p style={{ color: "white", fontSize: "small" }}>
                  - Solstice Dashboard under the Licensing tab &gt; Device Info.
                </p>
                <p style={{ color: "white", fontSize: "small" }}>
                  - Solstice Cloud under Monitor &gt; Deployment.
                </p>

                <p style={{ color: "white", fontSize: "small" }}>
                  - Directly from the Pod’s “Update and Licensing” configuration
                  settings tab
                </p>
              </p>
            }
            placement="top"
          >
            <HelpIcon className={`icon icon-error-${deviceIdsInputError}`} />
          </SolsticeInfoTooltip>
        </span>
      </div>

      {loading ? (
        <button className={`submit-button-unactive`}>Loading ...</button>
      ) : (
        <button className="submit-button" onClick={handleDownloadClick}>
          Download
        </button>
      )}

      <MessageText
        text={messageTextValue}
        success={messageSuccess}
        hide={messageHide}
      />

      <MessageText
        text={errorMessageTextValue}
        success={errorMessageSuccess}
        hide={errorMessageHide}
      />
    </div>
  );
}
