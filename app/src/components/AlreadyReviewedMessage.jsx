
import { Link } from 'react-router-dom';

/**
 * A component to display a message when a user has already submitted a review.
 * @returns {JSX.Element}
 */




export default function AlreadyReviewedMessage() {


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <svg
                    className="mx-auto h-16 w-16 text-yellow-500"
                    xmlns="www.w3.org"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
                <h1 className="mt-4 text-2xl font-bold text-gray-900">
                    Review Already Submitted
                </h1>
                <p className="mt-2 text-gray-600">
                    You have already entered a review for this Load.
                </p>
                <div className="mt-6">
                    {/* Using a standard anchor tag for simplicity */}
                    <Link
                        to="https://boxtruckfs.com/" // This should be your application's home route
                        className=" cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teald-600 hover:bg-teald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

