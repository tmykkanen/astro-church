/* eslint-disable react/no-children-prop */
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { subscribeFormSchema } from "@/components/SubscribeForm/schema";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";

const SubscribeForm = () => {
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    validators: {
      onSubmit: subscribeFormSchema,
    },
    onSubmit: async ({ value }) => {
      const response = await fetch(
        `${import.meta.env.DEV ? "http://localhost:4321" : import.meta.env.SITE}/api/subscribe`,
        {
          method: "POST",
          body: JSON.stringify(value),
        },
      );

      const { code, message } = await response.json();

      if (code === "BAD_REQUEST") {
        toast.error(message);
        return;
      }

      if (code === "CONFLICT") toast.info(message);
      if (code === "SUCCESS") toast.success(message);

      form.reset();
    },
  });

  return (
    <>
      <form
        id="subscribe-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col gap-4"
      >
        <FieldGroup className="gap-4">
          <form.Field
            name="firstName"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="First Name"
                    autoComplete="off"
                    className="bg-muted text-muted-foreground focus-visible:ring-ring focus-visible:ring-2"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="lastName"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  {/*<FieldLabel htmlFor={field.name}>Last Name</FieldLabel>*/}
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Last Name"
                    autoComplete="off"
                    className="bg-muted text-muted-foreground focus-visible:ring-ring focus-visible:ring-2"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="email"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  {/*<FieldLabel htmlFor={field.name}>Email</FieldLabel>*/}
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="mail@example.com"
                    autoComplete="off"
                    className="bg-muted text-muted-foreground focus-visible:ring-ring focus-visible:ring-2"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit} variant="footer-button">
              {isSubmitting ? "..." : "Subscribe"}
            </Button>
          )}
        />
      </form>
      <Toaster />
    </>
  );
};

export default SubscribeForm;
