import solsticeLogo from "../assets/solstice-beta-logo.svg";
import CardText from "./CardText";

export default function Header() {
  return (
    <div className="header-container">
      <img src={solsticeLogo} className="logo" alt="Vite logo" />
      <p>
        Utilize this tool to download one or multiple license files for Mersive
        Pods running Solstice version 5.5.3 or higher
      </p>

      <CardText text={"Please enter the Pod Device IDs or Serial Numbers in the input field.
You can separate multiple entries using spaces, commas, or semicolons.
You can choose to save the license files to the root of a FAT32 formatted USB flash drive in order to force load them onto the Pods.
Once saved, insert the drive into the Pod's USB port to force-load the license.
If multiple Pods are being updated, you can save multiple license files to the same USB drive.
The USB flash drive MUST be inserted into an already fully powered up Pod.
If booting up the Pod, DO NOT have the flash drive in it. Wait until you see the standard Pod Welcome screen background.
"}/>
      {/* <h3>Solstice License Web Tool</h3> */}
    </div>
  );
}
