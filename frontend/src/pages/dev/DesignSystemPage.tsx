import {
  Button,
  Checkbox,
  Logo,
  OTPInput,
  TextInput,
  TimerText,
  Link,
} from "../../components/ui/atoms";

import {
  FormField, 
  FormRow,
} from "../../components/ui/molecules";

import {
  LoginForm,
} from "../../components/ui/organisms";

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background p-10">

      <h1 className="mb-8 text-3xl font-bold text-text-primary">
        UCEConnect Design System
      </h1>

      <div className="space-y-10">

        <section>
          <h2 className="mb-4 text-xl font-semibold">
            Horizontal Logos
          </h2>

          <div className="space-y-6">

            <Logo
              variant="horizontal-color"
              className="h-16"
            />

            <div className="rounded-lg bg-gray-900 p-6">
              <Logo
                variant="horizontal-white"
                className="h-16"
              />
            </div>

            <Logo
              variant="horizontal-dark"
              className="h-16"
            />

          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">
            Vertical Logos
          </h2>

          <div className="flex gap-8">

            <Logo
              variant="vertical-color"
              className="h-32"
            />

            <div className="rounded-lg bg-gray-900 p-6">
              <Logo
                variant="vertical-white"
                className="h-32"
              />
            </div>

            <Logo
              variant="vertical-dark"
              className="h-32"
            />

          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">
            Isotype Logos
          </h2>

          <div className="flex gap-8">

            <Logo
              variant="isotype-color"
              className="h-24"
            />

            <div className="rounded-lg bg-gray-900 p-6">
              <Logo
                variant="isotype-white"
                className="h-24"
              />
            </div>

            <Logo
              variant="isotype-dark"
              className="h-24"
            />

          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">
            Slogan Logos
          </h2>

          <div className="space-y-6">

            <Logo
              variant="horizontal-slogan-color"
              className="h-20"
            />

            <div className="rounded-lg bg-primary p-6">
              <Logo
                variant="horizontal-slogan-white"
                className="h-20"
              />
            </div>

          </div>
        </section>

        <section>
            <h2 className="mb-4 text-xl font-semibold">
                Buttons
            </h2>

            <div className="flex flex-wrap items-center gap-4">

                <Button variant="primary">
                Primary
                </Button>

                <Button variant="secondary">
                Secondary
                </Button>

                <Button variant="danger">
                Danger
                </Button>

                <Button variant="ghost">
                Ghost
                </Button>

                <Button variant="link">
                Link
                </Button>

                <Button size="sm">
                Small
                </Button>

                <Button size="md">
                Medium
                </Button>

                <Button size="lg">
                Large
                </Button>

                <Button disabled>
                Disabled
                </Button>

            </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">
            Text Input
          </h2>

          <div className="max-w-md space-y-4">

            <TextInput
              id="email"
              type="email"
              placeholder="Enter your institutional email"
            />

            <TextInput
              id="password"
              type="password"
              placeholder="Enter your password"
            />

            <TextInput
              id="disabled"
              disabled
              placeholder="Disabled"
            />

          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">
            Checkbox
          </h2>

          <div className="space-y-4">

            <Checkbox
              id="remember"
              label="Remember me"
            />

            <Checkbox
              id="checked"
              label="Checked"
              defaultChecked
            />

            <Checkbox
              id="disabled"
              label="Disabled"
              disabled
            />

          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">
            OTP Input
          </h2>

          <OTPInput />
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">
            Timer Text
          </h2>

          <div className="space-y-4">

            <TimerText
              time="00:59"
            />

            <TimerText
              label="Code expires in"
              time="04:32"
            />

          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">
            Links
          </h2>

          <div className="space-y-4">

            <Link href="#">
              Forgot password?
            </Link>

            <Link
              href="#"
              underline
            >
              Create account
            </Link>

          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">
            Form Field
          </h2>

          <div className="max-w-md space-y-6">

            <FormField
              id="email"
              label="Institutional email"
              required
            >
              <TextInput
                id="email"
                placeholder="Enter your institutional email"
              />
            </FormField>

            <FormField
              id="password"
              label="Password"
              error="Password is required."
            >
              <TextInput
                id="password"
                type="password"
              />
            </FormField>

          </div>
        </section>

        <section>

            <h2 className="mb-4 text-xl font-semibold">
                Form Row
            </h2>

            <div className="max-w-md">

                <FormRow>

                    <Checkbox
                        id="remember"
                        label="Remember me"
                    />

                    <Link href="#">
                        Forgot password?
                    </Link>

                </FormRow>

            </div>

        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">
            Login Form
          </h2>

          <div className="max-w-md rounded-xl border border-border bg-surface p-8">
            <LoginForm />
          </div>
        </section>

      </div>

    </div>
  );
}