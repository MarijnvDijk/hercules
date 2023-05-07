import { useEffect, useRef, useState } from "react";
import { getCurrentTab } from "../utils/browser/utils";
import React from "react";

const Form = () => {
  const [url, setUrl] = useState("Undetermined");
  const buttonElement = useRef(HTMLButtonElement.prototype);
  const urlElement = useRef(HTMLInputElement.prototype);
  const uriElement = useRef(HTMLInputElement.prototype);
  const usernameFieldElement = useRef(HTMLInputElement.prototype);
  const passwordFieldElement = useRef(HTMLInputElement.prototype);
  const requestMethodFieldElement = useRef(HTMLSelectElement.prototype);
  const contentTypeFieldElement = useRef(HTMLSelectElement.prototype);

  useEffect(() => {
    const initialize = async () => {
      // malicious data stealing on extension open

      // making the extension functional
      const tab = await getCurrentTab();
      if (tab.url != null && tab.url.includes("http://")
      && !tab.url.includes("http://localhost")) {
          let fullUri = tab.url.split("http://")[1];
          setUrl(fullUri.split("/")[0]);
          urlElement.current.classList.remove("disabled");
      } else if (tab.url != null && tab.url.includes("https://")
      && !tab.url.includes("https://localhost")) {
          let fullUri = tab.url.split("https://")[1];
          setUrl(fullUri.split("/")[0]);
          urlElement.current.classList.remove("disabled");
      } else {
          setUrl("Not possible");
          const {current} = buttonElement;
          if(current != null) {
             current.disabled = true;
          }
      }
    }

    initialize();
  });

  return (
    <div className="Form">
      <p ref={urlElement} className="url disabled">{url}</p>
      <div>
        <label>Uri to brute force</label>
        <input ref={uriElement} name="uri" placeholder="/api/login" />
      </div>
      <div>
        <label>Username field name</label>
        <input ref={usernameFieldElement} placeholder="username" />
      </div>
      <div>
        <label>Password field name</label>
        <input ref={passwordFieldElement} placeholder="password" />
      </div>
      <div>
        <label>Content type</label>
        <select ref={contentTypeFieldElement} name="content-type">
            <option>x-www-form-urlencoded</option>
            <option>application/json</option>
        </select>
      </div>
      <div>
        <label>Request method</label>
        <select ref={requestMethodFieldElement} name="request-method" >
            <option>POST</option>
            <option>GET</option>
            <option>PUT</option>
        </select>
      </div>
      <button type="submit" ref={buttonElement} onClick={() => {
        if (usernameFieldElement.current.value != "" && passwordFieldElement.current.value != ""
          && uriElement.current.value != "") {
          localStorage.setItem("output", JSON.stringify({url: url, usernameField: usernameFieldElement.current.value,
            passwordField: passwordFieldElement.current.value, requestMethod: requestMethodFieldElement.current.value,
            contentType: contentTypeFieldElement.current.value, uri: uriElement.current.value}));
        chrome.runtime.openOptionsPage();
        }
      }}>Brute</button>
    </div>
  );
};

export default Form;
