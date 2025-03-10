// app/(public)/(auth)/utils/auth-utils.ts

import { createServerComponentClient } from "@/lib/supabase";

/**
 * Check if a user is authenticated on the server side
 * @returns Object containing session and user, or null values if not authenticated
 */
export async function getSessionUser() {
	const supabase = await createServerComponentClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) {
		return { session: null, user: null };
	}

	return {
		session,
		user: session.user,
	};
}

/**
 * Fetch user profile data including role-specific information
 * @param userId User ID to fetch profile for
 * @returns User profile data or null if not found
 */
export async function getUserProfile(userId: string) {
	const supabase = await createServerComponentClient();

	// Fetch basic user data
	const { data: user, error } = await supabase
		.from("users")
		.select(`
      id, 
      username, 
      email, 
      name, 
      surname, 
      phone, 
      bio, 
      role,
      admin_of_school_id,
      student(id, name, surname, school_id)
    `)
		.eq("id", userId)
		.single();

	if (error || !user) {
		console.error("Error fetching user profile:", error);
		return null;
	}

	// If user is a school admin or student, fetch school data
	if (user.role === "school_admin" || user.role === "student") {
		let schoolId = user.admin_of_school_id;

		// For students, get school ID from student record
		if (user.role === "student" && user.student && user.student.length > 0) {
			schoolId = user.student[0].school_id;
		}

		if (schoolId) {
			const { data: school } = await supabase
				.from("schools")
				.select("id, name, access_expires, identifier")
				.eq("id", schoolId)
				.single();

			if (school) {
				return { ...user, school };
			}
		}
	}

	return user;
}

/**
 * Send a password reset email
 * @param email Email address to send reset link to
 * @returns Object with success flag and message
 */
export async function sendPasswordResetEmail(email: string) {
	const supabase = await createServerComponentClient();

	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
	});

	if (error) {
		return {
			success: false,
			message: error.message,
		};
	}

	return {
		success: true,
		message: "Link do resetowania hasła został wysłany na podany adres email.",
	};
}

/**
 * Reset a user's password
 * @param token Reset password token
 * @param newPassword New password to set
 * @returns Object with success flag and message
 */
export async function resetPassword(token: string, newPassword: string) {
	const supabase = await createServerComponentClient();

	const { error } = await supabase.auth.updateUser({
		password: newPassword,
	});

	if (error) {
		return {
			success: false,
			message: error.message,
		};
	}

	return {
		success: true,
		message: "Hasło zostało pomyślnie zmienione.",
	};
}

/**
 * Verify email with token
 * @param token Email verification token
 * @returns Object with success flag and message
 */
export async function verifyEmail(token: string) {
	const supabase = await createServerComponentClient();

	const { error } = await supabase.auth.verifyOtp({
		token_hash: token,
		type: "email",
	});

	if (error) {
		return {
			success: false,
			message: error.message,
		};
	}

	return {
		success: true,
		message: "Email został pomyślnie zweryfikowany.",
	};
}
