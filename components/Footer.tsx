import React from "react";
import { Separator } from "@/components//ui/separator";
import Link from "next/link";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div className=" bg-neutral-800 flex flex-col w-full">
      <div className="flex md:flex-row flex-col w-full px-10 justify-center gap-12 py-12">
        <div className="flex flex-col gap-4 text-white w-full">
          <h3>O nas</h3>
          <Separator className="w-12 h-[2px] bg-amber-500" />
          <p className="font-light font-sans">
            Jesteśmy firmą, która powstała, żeby odpowiedzieć na potrzeby branży
            transportowej. Zajmujemy się szkoleniami, ubezpieczeniami,
            zapewniamy łatwy dostęp do akcesoriów niezbędnych w transporcie.
            Zaufaj nam - razem stworzymy lepszy transport.
          </p>
          <Link href="https://www.facebook.com/fenilopl">
            <svg
              className="h-6 w-6 group hover:cursor-pointer hover:scale-110 transition-all duration-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2 6C2 3.79086 3.79086 2 6 2H18C20.2091 2 22 3.79086 22 6V18C22 20.2091 20.2091 22 18 22H6C3.79086 22 2 20.2091 2 18V6ZM6 4C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H12V13H11C10.4477 13 10 12.5523 10 12C10 11.4477 10.4477 11 11 11H12V9.5C12 7.567 13.567 6 15.5 6H16.1C16.6523 6 17.1 6.44772 17.1 7C17.1 7.55228 16.6523 8 16.1 8H15.5C14.6716 8 14 8.67157 14 9.5V11H16.1C16.6523 11 17.1 11.4477 17.1 12C17.1 12.5523 16.6523 13 16.1 13H14V20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6Z"
                  fill="#FFFFFF"
                ></path>{" "}
              </g>
            </svg>
          </Link>
        </div>
        <div className="flex sm:flex-row flex-col gap-4 w-full">
          <div className="flex flex-col gap-4 w-full ">
            <h3 className="text-white">Przydatne linki</h3>
            <Separator className="w-12 h-[2px] bg-amber-500" />
            <div className="flex flex-col w-full gap-4 text-neutral-600 text-sm uppercase">
              <a
                className="hover:text-amber-500 transition-all duration-500"
                href="/privacy-policy"
              >
                Polityka prywatności
              </a>
              <Separator className="bg-neutral-600 w-4/5" />
              <a
                className="hover:text-amber-500 transition-all duration-500"
                href="/rodo"
              >
                RODO
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full text-white">
            <h3>Skontaktuj się z nami</h3>
            <Separator className="w-12 h-[2px] bg-amber-500" />
            <div className="flex flex-col w-full gap-4 text-neutral-600 text-sm">
              <Link href="tel:+48 789 567 099">
                <div className="flex flex-row gap-4 group hover:cursor-pointer text-white">
                  <svg
                    className="w-6 h-6 group-hover:scale-110 transition-all duration-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.73268 2.043C6.95002 0.832583 8.95439 1.04804 9.9737 2.40962L11.2347 4.09402C12.0641 5.20191 11.9909 6.75032 11.0064 7.72923L10.7676 7.96665C10.7572 7.99694 10.7319 8.09215 10.76 8.2731C10.8232 8.6806 11.1635 9.545 12.592 10.9654C14.02 12.3853 14.8905 12.7253 15.3038 12.7887C15.4911 12.8174 15.5891 12.7906 15.6194 12.78L16.0274 12.3743C16.9026 11.5041 18.2475 11.3414 19.3311 11.9305L21.2416 12.9691C22.8775 13.8584 23.2909 16.0821 21.9505 17.4148L20.53 18.8273C20.0824 19.2723 19.4805 19.6434 18.7459 19.7119C16.9369 19.8806 12.7187 19.6654 8.28659 15.2584C4.14868 11.144 3.35462 7.556 3.25415 5.78817L4.00294 5.74562L3.25415 5.78817C3.20335 4.89426 3.62576 4.13796 4.16308 3.60369L5.73268 2.043ZM8.77291 3.30856C8.26628 2.63182 7.322 2.57801 6.79032 3.10668L5.22072 4.66737C4.8908 4.99542 4.73206 5.35695 4.75173 5.70307C4.83156 7.10766 5.47286 10.3453 9.34423 14.1947C13.4057 18.2331 17.1569 18.3536 18.6067 18.2184C18.9029 18.1908 19.1975 18.0369 19.4724 17.7636L20.8929 16.3511C21.4704 15.777 21.343 14.7315 20.5252 14.2869L18.6147 13.2484C18.0871 12.9616 17.469 13.0562 17.085 13.438L16.6296 13.8909L16.1008 13.359C16.6296 13.8909 16.6289 13.8916 16.6282 13.8923L16.6267 13.8937L16.6236 13.8967L16.6171 13.903L16.6025 13.9166C16.592 13.9262 16.5799 13.9367 16.5664 13.948C16.5392 13.9705 16.5058 13.9959 16.4659 14.0227C16.3858 14.0763 16.2801 14.1347 16.1472 14.1841C15.8764 14.285 15.5192 14.3392 15.0764 14.2713C14.2096 14.1384 13.0614 13.5474 11.5344 12.0291C10.0079 10.5113 9.41194 9.36834 9.2777 8.50306C9.20906 8.06061 9.26381 7.70331 9.36594 7.43225C9.41599 7.29941 9.47497 7.19378 9.5291 7.11389C9.5561 7.07405 9.58179 7.04074 9.60446 7.01368C9.6158 7.00015 9.6264 6.98817 9.63604 6.9777L9.64977 6.96312L9.65606 6.95666L9.65905 6.95363L9.66051 6.95217C9.66122 6.95146 9.66194 6.95075 10.1908 7.48258L9.66194 6.95075L9.94875 6.66556C10.3774 6.23939 10.4374 5.53194 10.0339 4.99297L8.77291 3.30856Z"
                        fill="white"
                        className="group-hover:fill-amber-500 transition-all duration-500"
                      ></path>{" "}
                    </g>
                  </svg>
                  <p className="group-hover:text-amber-500 transition-all duration-500">
                    +48 789 567 099
                  </p>
                </div>
              </Link>

              <Link href="mailto:fenilo@fenilo.pl">
                <div className="flex flex-row gap-4 group hover:cursor-pointer text-white">
                  <svg
                    className="w-6 h-6 group-hover:scale-110 transition-all duration-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M2.54433 5.16792C3.0468 4.46923 3.86451 4 4.8 4H19.2C20.1355 4 20.9532 4.46923 21.4557 5.16792C21.7993 5.64567 22 6.235 22 6.86667V17.1333C22 18.682 20.7804 20 19.2 20H4.8C3.21964 20 2 18.682 2 17.1333V6.86667C2 6.23499 2.20074 5.64567 2.54433 5.16792ZM4.9327 6L11.2598 12.9647C11.6566 13.4015 12.3434 13.4015 12.7402 12.9647L19.0673 6H4.9327ZM20 7.94766L14.2205 14.3096C13.0301 15.6199 10.9699 15.6199 9.77948 14.3096L4 7.94766V17.1333C4 17.6466 4.39214 18 4.8 18H19.2C19.6079 18 20 17.6466 20 17.1333V7.94766Z"
                        fill="white"
                        className="group-hover:fill-amber-500 transition-all duration-500"
                      ></path>{" "}
                    </g>
                  </svg>
                  <p className="group-hover:text-amber-500 transition-all duration-500 ">
                    fenilo@fenilo.pl
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
