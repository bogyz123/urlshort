import { useState } from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import styles from "../assets/URLShortener.module.css";

export default function URLShortener() {
  const [urlToShorten, setUrlToShorten] = useState("");
  const [oldUrl, setOldUrl] = useState(null);
  const [newUrl, setNewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [animation, setAnimation] = useState(false);

  const nav = useNavigate();

  const reset = () => {
    setAnimation(false);
    setNewUrl(null);
    setOldUrl(null);
    setUrlToShorten("");
    nav("/");
  };

  const handleShortenURL = async () => {
    if (!urlToShorten || urlToShorten.length <= 3) {
      setError({ message: "You have entered an incorrect URL." });
      return;
    }

    const endpoint = `https://0382-178-223-10-224.ngrok-free.app/shortenUrl/${urlToShorten}`;
    try {
      const response = await fetch(endpoint, {
        headers: {
          accept: 'application/json',
          "ngrok-skip-browser-warning": "1",
        },
      });
      const data = await response.json();
      setNewUrl(data.short);
      setOldUrl(urlToShorten);
      setAnimation(true);
    } catch (err) {
      setError({ message: "Network error: " + err.message });
      console.error(err);
    }
  };

  return (
    <div id={styles.urlShortener}>
      <div id={styles.shortenerInner} className={`${animation && styles.animationNarrow}`}>
        {animation ? (
          <>
            <div onClick={reset} style={{ cursor: 'pointer' }}>X</div>
            <div id={styles.shortenedData}>
              {oldUrl && newUrl && (
                <>
                  <span style={{ textAlign: 'center' }}>Successfully shortened URL!</span>
                  <table className={styles.tableStyle}>
                    <tbody>
                      <tr>
                        <td className={styles.tableCellHeader}><strong>Old URL:</strong></td>
                        <td className={styles.tableCellData}>{oldUrl}</td>
                      </tr>
                      <tr>
                        <td className={styles.tableCellHeader}><strong>New URL:</strong></td>
                        <td className={styles.tableCellData}>{newUrl}</td>
                      </tr>
                      <tr>
                        <td className={styles.tableCellHeader}><strong>QR Code:</strong></td>
                        <td className={styles.tableCellData}>
                          <QRCode value={newUrl} size={128} />
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.tableCellHeader}></td>
                        <td className={styles.tableCellData}>
                          <button className={styles.btnCopy} onClick={() => navigator.clipboard.writeText(`https://urlshort-jade.vercel.app/#/${newUrl}`)}>
                            Copy Link
                          </button>
                          <button className={styles.btnOpen} onClick={() => window.open(`https://urlshort-jade.vercel.app/#/${newUrl}`, '_blank')}>
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
              <button onClick={handleShortenURL} className={`${styles.btn} ${styles.animated}`} id={styles.linkify}>
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