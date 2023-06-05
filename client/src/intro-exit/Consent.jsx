import React from "react";
import { Button } from "../components/Button";

export function Consent({ onConsent }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const consent = data.get("consent");
    if (consent === "yes") {
      onConsent();
    } else {
      window.location.href = "https://www.stanford.edu/";
    }
  };

  return (
    <div className="mt-3 sm:mt-5 p-20 w-full max-w-screen-md mx-auto">
      <div class="prose prose-bluegray">
        <h3>Consent form</h3>

        <p>
          I agree to participate in a research study conducted by the
          Massachusetts Institute of Technology. In order to analyze responses
          to the questionnaire, my answers will be recorded. No identifying
          information about me will be made public and any views I express will
          be kept completely confidential. Findings from this study will be
          reported in scholarly journals, at academic seminars, and at research
          association meetings. The data will be stored at a secured location
          and retained indefinitely. My participation is voluntary. I am free to
          withdraw from the study at any time. Should you have questions, please
          contact us at fangdav2@gmail.com.
        </p>
      </div>
      <div className="mt-6">
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend className="text-gray-700 mb-4">
              Please select one of the following options. If you choose not to
              participate, the survey will end immediately.
            </legend>
            <div className="text-gray-700 space-y-2 mb-8">
              <div className="space-x-2">
                <input
                  type="radio"
                  id="consentGiven"
                  name="consent"
                  value="yes"
                  required
                />
                <label for="consentGiven">I agree to participate</label>
              </div>
              <div className="space-x-2">
                <input
                  type="radio"
                  id="consentNotGiven"
                  name="consent"
                  value="no"
                />
                <label for="consentNotGiven">
                  I don't agree to participate
                </label>
              </div>
            </div>
            <div>
              <Button type="submit">
                <p>Next</p>
              </Button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
