import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";
import { Head } from "@inertiajs/react";

const PricingAndRates = ({ settings }) => {
    const { data, setData, put, processing, errors, recentlySuccessful } =
        useForm({
            global_discount_percentage:
                settings.global_discount_percentage || "0",
            default_tax_rate: settings.default_tax_rate || "10",
            weekend_surcharge_percentage:
                settings.weekend_surcharge_percentage || "0",
            currency_symbol: settings.currency_symbol || "₱",
        });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.settings.updatePricingAndRates"));
    };

    return (
        <AdminLayout>
            <Head title="Pricing & Rates Settings" />

            <div className="space-y-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="pb-4 border-b border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Pricing & Rates
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage global pricing configurations for your hotel.
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="bg-white p-6 rounded-2xl shadow-md space-y-6"
                >
                    <h2 className="text-xl font-semibold text-gray-800">
                        Global Pricing
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel
                                htmlFor="currency_symbol"
                                value="Currency Symbol"
                            />
                            <TextInput
                                id="currency_symbol"
                                value={data.currency_symbol}
                                onChange={(e) =>
                                    setData("currency_symbol", e.target.value)
                                }
                                type="text"
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError
                                message={errors.currency_symbol}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="global_discount_percentage"
                                value="Global Discount (%)"
                            />
                            <TextInput
                                id="global_discount_percentage"
                                value={data.global_discount_percentage}
                                onChange={(e) =>
                                    setData(
                                        "global_discount_percentage",
                                        e.target.value
                                    )
                                }
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError
                                message={errors.global_discount_percentage}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="default_tax_rate"
                                value="Default Tax Rate (%)"
                            />
                            <TextInput
                                id="default_tax_rate"
                                value={data.default_tax_rate}
                                onChange={(e) =>
                                    setData("default_tax_rate", e.target.value)
                                }
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError
                                message={errors.default_tax_rate}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="weekend_surcharge_percentage"
                                value="Weekend Surcharge (%)"
                            />
                            <TextInput
                                id="weekend_surcharge_percentage"
                                value={data.weekend_surcharge_percentage}
                                onChange={(e) =>
                                    setData(
                                        "weekend_surcharge_percentage",
                                        e.target.value
                                    )
                                }
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError
                                message={errors.weekend_surcharge_percentage}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-6">
                        <PrimaryButton disabled={processing}>
                            Save Changes
                        </PrimaryButton>
                        {recentlySuccessful && (
                            <p className="text-sm text-gray-600">Saved.</p>
                        )}
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default PricingAndRates;
