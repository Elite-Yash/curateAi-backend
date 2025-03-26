import { UserService } from 'src/modules/user/user.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { sendErrorResponse, sendSuccessResponse } from 'src/helpers/commonHelper';
import { CreateSubscriptionDto } from '../user-subscription/dto/createSubscription.dto';
import { CHECKOUT_SESSION_CREATED_SUCCESSFULLY, CUSTOMER_NOT_FOUND, INVALID_PLAN_ID, PLANS_FETCHED_SUCCESSFULLY, SUBSCRIPTION_DETAILS_FETCHED_SUCCESSFULLY } from 'src/constants/stripeMessages';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { Repository } from 'typeorm';
import { UserSubscription } from 'src/user-subscription/entities/user-subscription.entity';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(
        private readonly configService: ConfigService,
        @Inject(forwardRef(() => UserService)) // Handle circular dependency
        private readonly userService: UserService,

        @InjectRepository(Plan)
        private planRepository: Repository<Plan>,

        @InjectRepository(UserSubscription)
        private userSubscriptionRepository: Repository<UserSubscription>,
    ) {
        const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
        if (!stripeSecretKey) {
            throw new Error('Stripe secret key not found. Please check your environment variables.');
        }

        this.stripe = new Stripe(stripeSecretKey);
    }

    async createCustomer(email: string, name: string): Promise<Stripe.Customer> {
        return this.stripe.customers.create({
            email,
            name,
        });
    }

    async getAllPlans(): Promise<any> {
        try {

            const allPlans = await this.planRepository.find();
            return sendSuccessResponse(PLANS_FETCHED_SUCCESSFULLY, allPlans);
        } catch (error) {
            return sendErrorResponse('Failed to fetch plans', error);
        }
    }
    async createSubscription(userId: number, createSubscriptionDto: CreateSubscriptionDto): Promise<any> {
        try {
            const { planId } = createSubscriptionDto;
            const userDetails = await this.userService.findById(userId);
            const customerId = userDetails.stripe_customer_id;

            if (!customerId) {
                return sendErrorResponse(CUSTOMER_NOT_FOUND);
            }

            // Retrieve the Price ID
            const planDetails = await this.planRepository.findOneBy({ stripe_plan_id: planId });

            if (!planDetails) {
                return sendErrorResponse(INVALID_PLAN_ID);
            }
            // Explicitly type the session data
            const sessionData: Stripe.Checkout.SessionCreateParams = {
                mode: 'subscription',
                customer: customerId,
                line_items: [
                    {
                        price: planDetails.stripe_plan_id,
                        quantity: 1,
                    },
                ],
                allow_promotion_codes: true,
                success_url: `${process.env.FRONTEND_URL}/payment/success`,
                cancel_url: `${process.env.FRONTEND_URL}/payment/failure`,
            };

            const session = await this.stripe.checkout.sessions.create(sessionData);

            return sendSuccessResponse(CHECKOUT_SESSION_CREATED_SUCCESSFULLY, session.url);
        } catch (error) {
            console.error('Error creating checkout session:', error);
            return sendErrorResponse('Error creating subscription', error.message);
        }
    }

    async getActiveSubscriptions(userId: number): Promise<any> {
        try {
            // Fetch user details
            const userDetails = await this.userService.findById(userId);
            if (!userDetails || !userDetails.stripe_customer_id) {
                throw new Error("User not found or missing Stripe customer ID");
            }

            const customerId = userDetails.stripe_customer_id;

            // Fetch current plan subscriptions
            const { subscriptions } = await this.getCurrentPlan(customerId);

            if (!subscriptions) {
                throw new Error("No active subscriptions found");
            }
            // const subscriptions = await this.userSubscriptionRepository.findOne({
            //     where: { user_id: userId, status: 'active' },
            // });
            return sendSuccessResponse(SUBSCRIPTION_DETAILS_FETCHED_SUCCESSFULLY, subscriptions);
        } catch (error) {
            console.error("Error fetching active subscriptions:", error);
            return sendErrorResponse("Error fetching active subscriptions", error.message);
        }
    }


    // async stripeCustomerSubscriptionCreatedWebhook(webhookData: any): Promise<any> {
    //     try {
    //         const subscriptionId = webhookData.data.object.id;
    //         const customerId = webhookData.data.object.customer;
    //         const stripePlanId = webhookData.data.object.plan.id;
    //         const planInterval = webhookData.data.object.plan.interval;
    //         const subscriptionStatus = webhookData.data.object.status;

    //         console.log("Webhook Data:", webhookData);
    //         console.log("Subscription ID:", subscriptionId);
    //         console.log("Customer ID:", customerId);
    //         console.log("Stripe Plan ID:", stripePlanId);
    //         console.log("Plan Interval:", planInterval);
    //         console.log("Subscription Status:", subscriptionStatus);

    //         const userDetails = await this.userService.findByStripeCustomerId(customerId);
    //         console.log("User Details:", userDetails);

    //         if (!userDetails) {
    //             throw new Error("User not found");
    //         }


    //         // Check if the user already has an active subscription
    //         const userSubscription = await this.userSubscriptionRepository.findOne({
    //             where: {
    //                 user_id: userDetails.id,
    //                 status: 'active',
    //             },
    //         });

    //         if (userSubscription) {
    //             throw new Error("User already has an active subscription");
    //         }

    //         // Create new subscription entry
    //         const newSubscription = this.userSubscriptionRepository.create({
    //             user_id: userDetails.id,
    //             stripe_customer_id: customerId,
    //             stripe_subscription_id: subscriptionId,
    //             stripe_plan_id: stripePlanId,
    //             stripe_plan_duration: planInterval,
    //             status: subscriptionStatus,
    //         });

    //         await this.userSubscriptionRepository.save(newSubscription);

    //         return sendSuccessResponse("Subscription created successfully");
    //     } catch (error) {
    //         console.error("Error in stripeCustomerSubscriptionCreatedWebhook:", error);
    //         return sendErrorResponse("Error processing subscription webhook", error.message);
    //     }
    // }


    // async stripeCustomerSubscriptionUpdatedWebhook(webhookData: any): Promise<any> {
    //     const subscriptionId = webhookData.data.object.id;

    //     const existingSubscriptions = await this.userSubscriptionRepository.find({
    //         where: {
    //             stripe_subscription_id: subscriptionId,
    //         },
    //     });

    //     for (const existingSubscription of existingSubscriptions) {

    //         if (existingSubscription.status == "incomplete") {
    //             existingSubscription.status = webhookData.data.object.status;
    //             await this.userSubscriptionRepository.save(existingSubscription);

    //             const userId = existingSubscription.user_id;

    //             await this.userService.updateUserSubscriptionStatus(userId, 'active');
    //         } else if (existingSubscription.status == "active") {
    //             const newPlanInterval = webhookData.data.object.plan.interval;
    //             const newPlanId = webhookData.data.object.plan.id;
    //             const existingPlanInterval = existingSubscription.stripe_plan_duration;

    //             if (newPlanInterval != existingPlanInterval) {
    //                 existingSubscription.status = 'inactive';
    //                 await this.userSubscriptionRepository.save(existingSubscription);

    //                 const userId = existingSubscription.user_id;

    //                 const newSubscription = this.userSubscriptionRepository.create({
    //                     user_id: userId,
    //                     stripe_customer_id: existingSubscription.stripe_customer_id,
    //                     stripe_subscription_id: subscriptionId,
    //                     stripe_plan_id: newPlanId,
    //                     stripe_plan_duration: newPlanInterval,
    //                     status: 'active',
    //                 });

    //                 const response = await this.userSubscriptionRepository.save(newSubscription);
    //             }


    //         }
    //     }

    //     return sendSuccessResponse('Subscription updated successfully');
    // }

    async changeSubscription(userId: number, createSubscriptionDto: CreateSubscriptionDto): Promise<any> {
        try {
            const { planId } = createSubscriptionDto;

            // Fetch user details
            const userDetails = await this.userService.findById(userId);
            if (!userDetails || !userDetails.stripe_customer_id) {
                throw new Error("Customer not found or missing Stripe ID.");
            }

            const customerId = userDetails.stripe_customer_id;

            // Retrieve plan details
            const planDetails = await this.planRepository.findOneBy({ stripe_plan_id: planId });
            if (!planDetails) {
                throw new Error("Invalid plan ID.");
            }

            // Get current subscription details
            const { subscriptions, currentPlanAmount } = await this.getCurrentPlan(customerId);
            if (!subscriptions || currentPlanAmount === undefined) {
                throw new Error("Failed to fetch current subscription details.");
            }

            const newPlanAmount = planDetails.plan_amount;

            // Determine if it's an upgrade or downgrade
            if (newPlanAmount > currentPlanAmount) {
                return await this.upgradePlan(userId, customerId, subscriptions, planDetails);
            } else if (newPlanAmount < currentPlanAmount) {
                return await this.downgradePlan(userId, customerId, subscriptions, planDetails);
            }

            return { success: false, message: "No change in subscription plan." };
        } catch (error) {
            console.error("Error updating subscription:", error);
            return sendErrorResponse("Error updating subscription", error.message);
        }
    }

    private async getCurrentPlan(customerId: any): Promise<any> {
        try {
            const subscriptions = await this.stripe.subscriptions.list({
                customer: customerId,
            });

            // Check if user has active subscriptions
            if (!subscriptions.data.length) {
                throw new Error("No active subscriptions found for this customer.");
            }

            const subscription = subscriptions.data[0]; // Get first active subscription
            const subscriptionItem = subscription.items.data[0]; // Get first subscription item

            if (!subscriptionItem || !subscriptionItem.price.id) {
                throw new Error("No valid subscription item found.");
            }

            const priceId = subscriptionItem.price.id; // Get price ID

            // Fetch price details from Stripe
            const price = await this.stripe.prices.retrieve(priceId);

            // Get plan amount (Stripe stores amounts in cents)
            const planAmount = price.unit_amount ? price.unit_amount / 100 : 0;

            return { subscriptions, currentPlanAmount: planAmount };
        } catch (error) {
            console.error("Error fetching current plan:", error);
            throw new Error(error.message || "Error fetching current plan");
        }
    }

    private async upgradePlan(userId: number, customerId: string, subscriptions: any, planDetails: any): Promise<any> {
        try {
            const subscription = subscriptions.data[0]; // Get the first active subscription
            const subscriptionItem = subscription.items.data[0]; // Get the first subscription item

            if (!subscriptionItem) {
                throw new Error("No subscription item found for this subscription.");
            }

            await this.stripe.subscriptions.update(subscription.id, {
                cancel_at_period_end: false,
                items: [
                    {
                        id: subscriptionItem.id,
                        price: planDetails.stripe_plan_id,
                    },
                ],
                proration_behavior: "create_prorations",
                billing_cycle_anchor: "now",
                trial_end: "now",
            });

            // // Update SQL database
            // await this.userSubscriptionRepository.update(
            //     { stripe_customer_id: customerId },
            //     { stripe_plan_id: planDetails.stripe_plan_id, stripe_plan_duration: planDetails.plan_duration }
            // );

            console.log(`User ${userId} upgraded to plan ${planDetails.stripe_plan_id}`);

            return { success: true, message: 'Plan upgraded successfully', newPlanId: planDetails.stripe_plan_id };
        } catch (error) {
            console.error('Error upgrading plan:', error);
            return sendErrorResponse('Error upgrading plan', error.message);
        }
    }

    private async downgradePlan(userId: number, customerId: string, subscriptions: any, planDetails: any): Promise<any> {
        try {
            const subscription = subscriptions.data[0]; // Get the first active subscription
            const subscriptionItem = subscription.items.data[0]; // Get the first subscription item

            if (!subscriptionItem) {
                throw new Error("No subscription item found for this subscription.");
            }

            await this.stripe.subscriptions.update(subscription.id, {
                cancel_at_period_end: true, // Downgrade happens at the end of the billing period
            });

            // Get current subscription period end date (Unix timestamp)
            const currentPlanEndDate = subscription.current_period_end;

            // Schedule downgrade after current plan ends
            await this.stripe.subscriptionSchedules.create({
                customer: customerId,
                start_date: currentPlanEndDate, // Schedule downgrade for next cycle
                end_behavior: "release", // Ensures subscription continues
                phases: [
                    {
                        items: [
                            {
                                price: planDetails.stripe_plan_id,
                                quantity: 1,
                            },
                        ],
                    },
                ],
            });

            console.log(`User ${userId} downgraded to plan ${planDetails.stripe_plan_id}, effective at period end.`);

            return { success: true, message: 'Plan downgrade scheduled', newPlanId: planDetails.stripe_plan_id };
        } catch (error) {
            console.error('Error downgrading plan:', error);
            return sendErrorResponse('Error downgrading plan', error.message);
        }
    }

}
