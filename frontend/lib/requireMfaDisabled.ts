import { GetServerSideProps } from "next";
import { withUserSSR } from "./withUserSSR";

export const requireMfaDisabled = (gssp?: GetServerSideProps) =>
    withUserSSR(async ctx => {
      const { user } = ctx.req as any;
      if (user?.mfaEnabled && user.mfaEnabled !== false)
        return { redirect: { destination: '/user/profile', permanent: false } };
      return gssp ? gssp(ctx) : { props: {} };
    });