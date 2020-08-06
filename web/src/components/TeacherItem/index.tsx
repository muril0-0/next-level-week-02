import React from "react";

import whatsappIcon from "../../assets/images/icons/whatsapp.svg";

import "./style.css";

function TeacherItem() {
  return (
    <article className="teacher-item">
      <header>
        <img
          src="https://api.adorable.io/avatars/285/ZeDaLambretinha.png"
          alt="Adorable Avatar"
        />
        <div>
          <strong>Zé da Lambretinha</strong>
          <span>Vida</span>
        </div>
      </header>

      <p>
        Mussum Ipsum, cacilds vidis litro abertis.
        <br />
        <br />
        Suco de cevadiss deixa as pessoas mais interessantis. Vehicula non. Ut
        sed ex eros. Vivamus sit amet nibh non tellus tristique interdum. Si num
        tem leite então bota uma pinga aí cumpadi!
      </p>

      <footer>
        <p>
          Preço/Hora
          <strong>R$ 100,00</strong>
        </p>
        <button type="button">
          <img src={whatsappIcon} alt="Whatsapp" />
          Entrar em contato
        </button>
      </footer>
    </article>
  );
}

export default TeacherItem;
