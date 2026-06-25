import { Logo } from "../../components/ui/atoms/Logo";
import { Button } from "../../components/ui/atoms/Button";
import { TextInput } from "../../components/ui/atoms/TextInput";

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
                Text Inputs
            </h2>

            <div className="max-w-md space-y-6">

                <TextInput
                id="email"
                label="Institutional email"
                placeholder="Enter your institutional email"
                type="email"
                />

                <TextInput
                id="password"
                label="Password"
                placeholder="Enter your password"
                type="password"
                />

                <TextInput
                id="error"
                label="Institutional email"
                error="Invalid institutional email."
                />

                <TextInput
                id="disabled"
                label="Disabled field"
                placeholder="Disabled"
                disabled
                />

            </div>
        </section>
      </div>

    </div>
  );
}