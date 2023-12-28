import solsticeLogo from '../assets/solstice-beta-logo.svg'

export default function Header() {
    return (
        <div className='header-container'>

          <img src={solsticeLogo} className="logo" alt="Vite logo" />
          <p>Utilize this tool to download one or multiple license files for Mersive Pods running Solstice version 5.5.3 or higher and to to push one license file to a Mersive Pod running Solstice version 5.5.3 or higher</p>
       {/* <h3>Solstice License Web Tool</h3> */}
      </div>
    );
  }