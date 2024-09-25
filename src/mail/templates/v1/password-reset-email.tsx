import V1EmailLayout from "../layouts/v1-layout";
import { Text, Heading, Section } from "@react-email/components";

interface EmailProp {
    name: string;
    resetOTP: string;
}

export default function Email({ name, resetOTP }: EmailProp) {
    return (
        <V1EmailLayout>
            <Section className="bg-white py-10 px-2 md:px-10">
                <Heading as="h2" className="text-xl font-bold">
                    Hi {name || "there"}
                </Heading>

                <Text className="text-lg font-normal">Use the OTP below to reset your password.</Text>

                <Section className="bg-gray-100 p-4 mt-8">
                    <Text className="text-2xl font-bold text-center">{resetOTP}</Text>
                </Section>

                <Text className="text-lg font-normal">
                    Thanks!
                    <br />
                    <b>nodejs-boilertemplate team</b>
                </Text>
            </Section>
        </V1EmailLayout>
    );
}
