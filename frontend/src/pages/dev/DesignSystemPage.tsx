import { Logo } from "../../components/ui/atoms/Logo";

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

      </div>

    </div>
  );
}