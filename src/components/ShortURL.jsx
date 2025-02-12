import { useEffect } from "react";
import { useParams } from "react-router";

export default function ShortURL() {
  const { url } = useParams();

  useEffect(() => {
    async function redirectToOriginalURL(shortenedUrl) {
      const endpoint = `https://0382-178-223-10-224.ngrok-free.app/getUrl/${shortenedUrl}`;
      try {
        const response = await fetch(endpoint, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "ngrok-skip-browser-warning": "1",
          },
        });

        if (response.status === 404) {
          return;
        }

        const json = await response.json();
        const originalURL = json.original;
        const urlToOpen = originalURL.startsWith("https://") || originalURL.startsWith("http://") ? originalURL : `https://${originalURL}`;
        window.location.href = urlToOpen;
      } catch (error) {
        console.error('Failed to redirect:', error);
      }
    }

    redirectToOriginalURL(url);
  }, [url]);

  const styles = {
    container: {
      position: "absolute",
      left: "0",
      top: "0",
      background: "rgba(0,0,0,.7)",
      width: "100%",
      height: "100%",
      color: "white",
      fontSize: "20px",
      textAlign: 'center',
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      userSelect: "none",
    },
  };

  return (
    <div style={styles.container}>
      <span>Loading {url}...</span>
    </div>
  );
}