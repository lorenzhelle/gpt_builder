import { Navbar, Tooltip } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

interface Props {
  readonly customBrand: React.ReactNode;
}

export const NavbarComponent: React.FC<Props> = ({ customBrand }) => {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand as={Link} href="#">
        {customBrand}
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Tooltip content="Not implemented" placement="left-start">
          <Navbar.Link disabled href="#">
            Log-In
          </Navbar.Link>
        </Tooltip>
      </Navbar.Collapse>
    </Navbar>
  );
};
