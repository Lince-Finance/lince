import React, { useState } from "react";
import UserLayout from "../../components/UserLayout";
import { csrfFetch } from "../../utils/fetcher";
import { withUserSSR } from "../../lib/withUserSSR";
import CustomContainer from "@/components/reusable/CustomContainer";
import { Box, Text } from "@chakra-ui/react";
import LoginFormHeading from "@/components/login/login-form-heading";
import { emailLoginBtnStyles } from "@/styles/reusable-styles";

interface Invitation {
  inviteCode: string;
  used: boolean;
  createdAt?: string;
}

function CreateInvitesPage() {
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
  const [invites, setInvites] = useState<Invitation[]>([]);
  const [msg, setMsg] = useState("");

  async function handleCreateOrList() {
    setMsg("Generating or listing invites...");
    try {
      const res = await csrfFetch(`${baseUrl}/user/invitations`, {
        method: "POST",
      });
      const data = await res.json();
      setInvites(data.invites);
      setMsg(`You have ${data.invites.length} invites now.`);
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  }

  return (
    <UserLayout>
      <CustomContainer p={"xl"}>
        {/* Top part */}
        <Box w={"100%"}>
          <LoginFormHeading
            title="Create or Show Invites (Up to 3)"
            desc="Create or Show Invites (Up to 3)"
          />
          <button onClick={handleCreateOrList} {...emailLoginBtnStyles}>
            Generate / Show
          </button>
          {msg && <p>{msg}</p>}
        </Box>

        {/* Bottom part */}
        <Box mt={4}>
          {invites.length > 0 && (
            <>
              <Text
                color="grayCliff.solid.50"
                fontWeight={"600"}
                fontSize={"4xs"}
              >
                Your Invites
              </Text>
              <ul>
                {invites.map((inv) => (
                  <li key={inv.inviteCode}>
                    Code: <strong>{inv.inviteCode}</strong>
                    {inv.used ? " (used)" : " (not used)"}
                    {inv.createdAt && <> - created at {inv.createdAt}</>}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Box>
      </CustomContainer>
    </UserLayout>
  );
}

export const getServerSideProps = withUserSSR();

export default CreateInvitesPage;
