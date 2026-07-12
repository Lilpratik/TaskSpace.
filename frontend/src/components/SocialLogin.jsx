import {
    FcGoogle
} from "react-icons/fc";

import {
    FaFacebookF
} from "react-icons/fa";

import {
    FaXTwitter
} from "react-icons/fa6";


const SocialLogin = () => {
    return (
        <div className="social-login">

            <button className="social-btn">
                <FcGoogle size={20} />
                Sign in with Google
            </button>

            <button className="social-btn">
                <FaXTwitter />
                Sign in with Twitter
            </button>

            <button className="social-btn">
                <FaFacebookF color="#1877F2" />
                Sign in with Facebook
            </button>

            <p className="policy">
                By signing in, you agree to our
                <span> Terms of Service </span>
                and
                <span> Privacy Policy </span>
            </p>

        </div>
    );
};

export default SocialLogin;