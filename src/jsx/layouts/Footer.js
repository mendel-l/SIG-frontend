import React from "react";

const Footer = () => {
	var d = new Date();
	return (
		<div className="footer out-footer">
			<div className="copyright">
				<p>Copyright © 
					{" "}Desarrollado por{" Sexto Semestre E "}
					<a href="https://www.mesoamericana.edu.gt/" target="_blank"  rel="noreferrer">
						Mesoamericana Quetzaltenango
					</a>{" "}
					{d.getFullYear()}
				</p>
			</div>
		</div>
	);
};

export default Footer;
