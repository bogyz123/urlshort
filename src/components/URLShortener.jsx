import { useState } from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import styles from "../assets/URLShortener.module.css";

export default function URLShortener() {
  const [urlToShorten, setUrlToShorten] = useState("");
  const [oldUrl, setOldUrl] = useState(null);
  const [newUrl, setNewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [animation, setAnimation] = useState(false);


  const nav = useNavigate();
  const reset = () => {
    nav("/");
    setCopied(false);
    setError(null);
    setNewUrl(null);
    setOldUrl(null);
    setUrlToShorten("");
    setAnimation(false);
  };
  return (
    <div id={styles.urlShortener}>
      <div id={styles.shortenerInner} className={`${animation && styles.animationNarrow}`}>
        {animation ? (
          <>
            <div id={styles.shortenedData}>
              {oldUrl && newUrl && (
             
             <>
             <span style={{textAlign: 'center'}}>Successfully shortened URL!</span>
             <table className={styles.tableStyle}>
      <tbody>
        <tr>
          <td className={styles.tableCellHeader}><strong>Old URL:</strong></td>
          <td className={styles.tableCellData}>{oldUrl}</td> {/* Replace `oldUrl` with your actual data */}
        </tr>
        <tr>
          <td className={styles.tableCellHeader}><strong>New URL:</strong></td>
          <td className={styles.tableCellData}>{newUrl}</td> {/* Replace `newUrl` with your actual data */}
        </tr>
        <tr>
          <td className={styles.tableCellHeader}><strong>QR Code:</strong></td>
          <td className={styles.tableCellData}>
            <QRCode value={newUrl} style={{ width: '128px' }} />
            {/* Replace `qrCodeUrl` with your actual QR code source */}
          </td>
        </tr>
        <tr>
          <td className={styles.tableCellHeader}></td>
          <td className={styles.tableCellData}>
            <button className={styles.btnCopy} onClick={() => navigator.clipboard.writeText("http://bogyz123.github.io/urlshort/#/"+newUrl)}>
              Copy Link
            </button>
            <button className={styles.btnOpen} onClick={() => window.open("https://bogyz123.github.io/urlshort/#/"+newUrl, '_blank')}>
              Open
            </button>
          </td>
        </tr>
      </tbody>
    </table>

           </>
           
              )}
            </div>
          </>
        ) : (
          <>
            <p className="text-center">Linkify | URL Shortener</p>
            <div className="flex | flexCol | gapX">
              <input type="text" placeholder="URL to shorten" onChange={(e) => setUrlToShorten(e.target.value)} />
              <button onClick={() => ShortenURL(urlToShorten, setOldUrl, setNewUrl, setError, setAnimation)} className={`${styles.btn} ${styles.animated}`} id={styles.linkify}>
                Linkify!
              </button>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className={styles.error}>
          <span>{error.message}</span>
        </div>
      )}
    </div>
  );
}

function ShortenURL(url, setOldUrl, setNewUrl, setError, setAnimation) {
  if (url && url.length > 3) {
    const endpoint = "https://3eec-178-223-10-224.ngrok-free.app/shortenUrl/" + url;

    fetch(endpoint, {
      headers: {
        accept: 'application/json',
        "ngrok-skip-browser-warning": "1",
      },
    })
    .then((res) => res.json()) // Wait for the JSON response
    .then((data) => {
      setNewUrl(data.short);
      setOldUrl(url);
      setAnimation(true);
    })
    .catch((err) => {
      setError({ message: "Network error: " + err.message });
      console.log(err)
    });
  } else {
    setError({ message: "You have entered an incorrect URL." });
  }
}
