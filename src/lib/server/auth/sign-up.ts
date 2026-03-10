import {authClient} from '$lib/server/auth/auth-client';

//like i guess bro...

type SignUpProps = {
	email: string;
	password: string;
	name: string;
}

export const SignUp = async (data: SignUpProps) => {
	await authClient.signUp.email({
		email: data.email,
		password: data.password,
		name: data.name,
		callbackURL: "/dashboard",
	}, {
		onRequest: (ctx) => {
			console.log(ctx);
			//show loading
		},
		onSuccess: (ctx) => {
			console.log(ctx);
			//redirect to dashboard/signin page
		},
		onError: (ctx) => {
			//display errormessage
			alert(ctx.error.message);
		}
	})
}

