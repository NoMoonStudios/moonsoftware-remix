import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import { Form, useActionData } from "@remix-run/react";

import Navigation from "~/components/pages/Navigation";
import Footer from "~/components/pages/Footer";
import { Toaster } from "~/components/ui/sonner";
import { Button } from "~/components/ui/button";
import { UserInfo } from "~/types/init";
import { GetUserSession } from "~/lib/Utilities/client";

// Define meta tags for SEO
export const meta: MetaFunction = () => {
  return [
    { title: "Contact Us - Moon Software" },
    { name: "description", content: "Get in touch with us for support, bug reports, business inquiries, or other matters." },
  ];
};

export default function Contact() {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>();
  const [reason, setReason] = useState("Support");
  const [customReason, setCustomReason] = useState("");
  const [links, setLinks] = useState(["", "", "", ""]);
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    let isMounted = true;
    GetUserSession().then((data) => {
      if (isMounted && data) setUserInfo(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Navigation userInfo={userInfo} />
      <div className="max-w-3xl mx-auto p-6">
        <Toaster />
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-base opacity-70">
          If you have any questions, issues, or business inquiries, feel free to reach out.
        </p>

        <Form method="post" encType="multipart/form-data" className="space-y-4 mt-6">
          {/* Reason for Contact */}
          <div>
            <select
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-[#1f1f1f] text-black dark:text-white"
            >

              <option value="Support">Support</option>
              <option value="Bug Report">Bug Report</option>
              <option value="Business">Business</option>
              <option value="Other">Other</option>
            </select>
            {reason === "Other" && (
              <input
                type="text"
                name="customReason"
                placeholder="Custom reason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full mt-2 p-2 border rounded"
              />
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block font-semibold mb-1">Subject</label>
            <input name="subject" className="w-full border p-2 rounded" required />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              name="description"
              className="w-full border p-2 rounded h-32"
              required
            />
          </div>

          {/* Media Upload */}
          <div>
            <label className="block font-semibold mb-1">Upload Media (optional)</label>
            <input type="file" name="media" multiple className="w-full" />
          </div>

          {/* Optional Links */}
          <div>
            <label className="block font-semibold mb-1">Optional Links</label>
            <div className="grid grid-cols-2 gap-2">
              {links.map((link, idx) => (
                <input
                  key={idx}
                  type="url"
                  name={`link${idx + 1}`}
                  placeholder={`Link ${idx + 1}`}
                  value={link}
                  onChange={(e) => {
                    const newLinks = [...links];
                    newLinks[idx] = e.target.value;
                    setLinks(newLinks);
                  }}
                  className="border p-2 rounded"
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Submit
          </Button>
        </Form>

        {/* Success Message */}
        {actionData?.success && (
          <p className="text-green-600 mt-4">Your message has been submitted successfully!</p>
        )}
      </div>

      <Footer />
    </>
  );
}
