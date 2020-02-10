import { pt } from 'date-fns/locale/pt';
import { format, parseISO } from 'date-fns';
import Mail from '../lib/Mail';

class DeliveryEmail {
  get key() {
    return 'DeliveryEmail';
  }

  async handle({ data }) {
    const { delivery } = data;

    await Mail.sendEmail({
      to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
      subject: 'Novo produto para entrega',
      template: 'delivery',
      context: {
        recipient: delivery.recipient.name,
        product: delivery.product,
        deliveryMan: delivery.deliveryman.name,
        date: format(
          parseISO(delivery.createdAt),
          "'Dia' dd 'de' MMMM', às' H:mm'h' ",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new DeliveryEmail();
